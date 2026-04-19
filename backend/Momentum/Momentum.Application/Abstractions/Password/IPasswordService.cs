using Momentum.SharedKernel;

namespace Momentum.Application.Abstractions.Password;

public interface IPasswordService
{
	Task<Result> RequestResetAsync(string email, CancellationToken ct);
	Task<Result<string>> VerifyCodeAsync(string email, string code, CancellationToken ct);
	Task<Result> ResetPasswordAsync(string resetSessionToken, string newPassword, CancellationToken ct);
}
