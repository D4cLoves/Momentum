using System.Text.Json;
using Momentum.Application.Abstractions.Ent;
using Momentum.Application.Abstractions.Persistence;
using Momentum.SharedKernel;
using StackExchange.Redis;

namespace Momentum.Infrastructure.Postgres.Services.Redis;

public sealed class RedisServiceResetPassword : IRedisServiceResetPassword
{
	private readonly IDatabase _db;
	private static readonly TimeSpan ResendCooldown = TimeSpan.FromSeconds(60);
	private static readonly TimeSpan CodeTtl = TimeSpan.FromMinutes(10);

	public RedisServiceResetPassword(IConnectionMultiplexer mux)
	{
		_db = mux.GetDatabase();
	}
	
	public async Task<Result> EnsureRequestRateLimitAsync(string email, CancellationToken ct)
	{
		var key = ResendKey(email);
		if (!await _db.StringSetAsync(key, "1", ResendCooldown, When.NotExists))
			return Result.Failure(Errors.IdentityError("Please wait before requesting another code."));
		return Result.Success();
	}
	
	public async Task<Result> SaveChallengeAsync(PasswordResetChallenge challenge, CancellationToken ct)
	{
		var key = ChallengeKey(challenge.NormalizedEmail);
		var value = JsonSerializer.Serialize(challenge);
		await _db.StringSetAsync(key, value, CodeTtl);
		await _db.KeyDeleteAsync(AttemptsKey(challenge.NormalizedEmail));
		return Result.Success();
	}

	public async Task<Result> SaveSessionTokenAsync(string email, string token, CancellationToken ct)
	{
		_ = ct;

		if (string.IsNullOrWhiteSpace(email))
			return Errors.ParamNull(nameof(email));

		if (string.IsNullOrWhiteSpace(token))
			return Errors.ParamNull(nameof(token));
		
		var normalizedEmail = email.Trim().ToUpperInvariant();
		var key = SessionTokenKey(token);
		
		await _db.StringSetAsync(key, normalizedEmail, CodeTtl);
			
		return Result.Success();
	}

	public async Task<Result<PasswordResetChallenge>> GetChallengeAsync(string email, CancellationToken ct)
	{
		_ = ct;

		if (string.IsNullOrWhiteSpace(email))
			return Errors.ParamNull(nameof(email));

		var key = ChallengeKey(email);
		var value = await _db.StringGetAsync(key);

		if (value.IsNullOrEmpty)
			return Errors.IdentityError("Reset code not found or expired.");

		var challenge = JsonSerializer.Deserialize<PasswordResetChallenge>((string)value!);
		if (challenge is null)
			return Errors.IdentityError("Invalid reset challenge payload.");

		return challenge;
	}

	public async Task<Result<string>> GetSessionTokenAsync(string resetSessionToken, CancellationToken ct)
	{
		_ = ct;

		if (string.IsNullOrWhiteSpace(resetSessionToken))
			return Errors.ParamNull(nameof(resetSessionToken));

		var key = SessionTokenKey(resetSessionToken);
		var value = await _db.StringGetAsync(key);
		if (value.IsNullOrEmpty)
			return Errors.IdentityError("Reset session token is invalid or expired.");

		return (string)value!;
	}

	public async Task<Result> DeleteChallenge(string email, CancellationToken ct)
	{
		_ = ct;
		
		if (string.IsNullOrWhiteSpace(email))
			return Errors.ParamNull(nameof(email));

		var key = ChallengeKey(email);
		
		await _db.KeyDeleteAsync(key);

		return Result.Success();
	}

	public async Task<Result> DeleteSessionTokenAsync(string resetSessionToken, CancellationToken ct)
	{
		_ = ct;

		if (string.IsNullOrWhiteSpace(resetSessionToken))
			return Errors.ParamNull(nameof(resetSessionToken));

		var key = SessionTokenKey(resetSessionToken);
		await _db.KeyDeleteAsync(key);

		return Result.Success();
	}


	private static string AttemptsKey(string email) => $"pwdreset:attempts:{email}";
	private static string ResendKey(string email) => $"pwdreset:resend:{email}";
	private static string ChallengeKey(string email) => $"pwdreset:challenge:{email}";
	private static string SessionTokenKey(string token) => $"pwdreset:session-token:{token}";
}
