using Momentum.Application.Features.Users.ResetPassword;
using Momentum.SharedKernel;

namespace Momentum.Application.Features.Users.Abstractions;

public interface IResetPasswordUseCase
{
	Task<Result> Handle(ResetPasswordRequest request, CancellationToken ct);
}