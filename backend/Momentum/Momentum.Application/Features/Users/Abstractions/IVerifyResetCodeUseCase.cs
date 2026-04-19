using Momentum.Application.Features.Users.VerifyResetCode;
using Momentum.SharedKernel;

namespace Momentum.Application.Features.Users.Abstractions;

public interface IVerifyResetCodeUseCase
{
	Task<Result<VerifyResetCodeResponse>> Handle(VerifyResetCodeRequest request, CancellationToken ct);
}