using System.Security.Cryptography;
using System.Text;

namespace Momentum.Application.Abstractions.Ent;

public sealed class PasswordResetChallenge
{
	public string UserId { get; init; } = default!;
	public string NormalizedEmail { get; init; } = default!;
	public string CodeHash { get; init; } = default!;
	public string Salt { get; init; } = default!;
	public DateTime ExpiresAtUtc { get; init; }

	public static PasswordResetChallenge Create(
		string userId,
		string normalizedEmail,
		string plainCode,
		DateTime expiresAtUtc)
	{
		var salt = Convert.ToBase64String(RandomNumberGenerator.GetBytes(16));
		var hashBytes = SHA256.HashData(Encoding.UTF8.GetBytes($"{plainCode}:{salt}"));
		var codeHash = Convert.ToBase64String(hashBytes);

		return new PasswordResetChallenge
		{
			UserId = userId,
			NormalizedEmail = normalizedEmail,
			CodeHash = codeHash,
			Salt = salt,
			ExpiresAtUtc = expiresAtUtc
		};
	}
}