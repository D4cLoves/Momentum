using Momentum.SharedKernel;

namespace Momentum.Application.Features.Users.ForgotPassword;

public sealed class ForgotPasswordHandler
{
	private readonly IForgotPasswordUseCase _useCase;
	
	public ForgotPasswordHandler(IForgotPasswordUseCase useCase)
	{
		_useCase = useCase;
	}
	
	public Task<Result> Handle(ForgotPasswordRequest request, CancellationToken ct = default)
	{
		ArgumentNullException.ThrowIfNull(request);
		return _useCase.Handle(request, ct);
	}
}