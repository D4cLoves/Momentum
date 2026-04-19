using Momentum.Application.Features.Users.Abstractions;
using Momentum.SharedKernel;

namespace Momentum.Application.Features.Users.VerifyResetCode;

public sealed class VerifyResetCodeHandler
{
	private readonly IVerifyResetCodeUseCase _useCase;
	
	public VerifyResetCodeHandler(IVerifyResetCodeUseCase useCase)
	{
		_useCase = useCase;
	}
	
	public Task<Result<VerifyResetCodeResponse>> Handle(VerifyResetCodeRequest request, CancellationToken ct = default)
	{
		ArgumentNullException.ThrowIfNull(request);
		return _useCase.Handle(request, ct);
	}
}