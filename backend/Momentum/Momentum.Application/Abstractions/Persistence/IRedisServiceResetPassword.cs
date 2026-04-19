using Momentum.Application.Abstractions.Ent;
using Momentum.SharedKernel;

namespace Momentum.Application.Abstractions.Persistence;

public interface IRedisServiceResetPassword
{
	Task<Result> EnsureRequestRateLimitAsync(string email, CancellationToken ct);
	Task<Result> SaveChallengeAsync(PasswordResetChallenge challenge, CancellationToken ct);
	Task<Result> SaveSessionTokenAsync(string email, string token, CancellationToken ct);
	Task<Result<PasswordResetChallenge>> GetChallengeAsync(string email, CancellationToken ct);
	Task<Result> DeleteChallenge(string email, CancellationToken ct);
	Task<Result<string>> GetSessionTokenAsync(string resetSessionToken, CancellationToken ct);
	Task<Result> DeleteSessionTokenAsync(string resetSessionToken, CancellationToken ct);
}
