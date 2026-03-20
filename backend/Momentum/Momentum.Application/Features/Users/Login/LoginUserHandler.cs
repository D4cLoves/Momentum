using Momentum.Application.Features.Users.Abstractions;
using Momentum.Application.Features.Users.Common;
using Momentum.SharedKernel;

namespace Momentum.Application.Features.Users.Login;

public sealed class LoginUserHandler
{
	private readonly ILoginUserUseCase _useCase;

	public LoginUserHandler(ILoginUserUseCase useCase)
	{
		_useCase = useCase;
	}

	public Task<Result<LoginTokens>> Handle(LoginUserRequest request, CancellationToken ct = default)
	{
		ArgumentNullException.ThrowIfNull(request);
		return _useCase.Handle(request, ct);
	}
}


