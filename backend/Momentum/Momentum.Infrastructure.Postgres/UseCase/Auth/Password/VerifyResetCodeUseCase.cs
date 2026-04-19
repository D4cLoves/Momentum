using Momentum.Application.Abstractions.Password;
using Momentum.Application.Features.Users.Abstractions;
using Momentum.Application.Features.Users.VerifyResetCode;
using Momentum.SharedKernel;

namespace Momentum.Infrastructure.Postgres.Services.Password;

public sealed class VerifyResetCodeUseCase(IPasswordService passwordService) : IVerifyResetCodeUseCase
{
	public async Task<Result<VerifyResetCodeResponse>> Handle(VerifyResetCodeRequest request, CancellationToken ct)
	{
		ArgumentNullException.ThrowIfNull(request);

		var verifyResult = await passwordService.VerifyCodeAsync(request.Email, request.Code, ct);
		if (verifyResult.IsFailure)
		{
			return verifyResult.Error;
		}

		return new VerifyResetCodeResponse(verifyResult.Value);
	}
}
