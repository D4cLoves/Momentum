using Momentum.SharedKernel;

namespace Momentum.Application.Features.Users.ForgotPassword;

public interface IForgotPasswordUseCase
{
	Task<Result> Handle(ForgotPasswordRequest request, CancellationToken ct = default);
}