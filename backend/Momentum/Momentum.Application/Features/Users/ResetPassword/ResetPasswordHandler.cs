using Momentum.Application.Features.Users.Abstractions;
using Momentum.SharedKernel;

namespace Momentum.Application.Features.Users.ResetPassword;

public sealed class ResetPasswordHandler
{
	private readonly IResetPasswordUseCase _useCase;
	
	public ResetPasswordHandler(IResetPasswordUseCase useCase)
	{
		_useCase = useCase;
	}
	
	public Task<Result> Handle(ResetPasswordRequest request, CancellationToken ct = default)
	{
		ArgumentNullException.ThrowIfNull(request);
		return _useCase.Handle(request, ct);
	}
}
