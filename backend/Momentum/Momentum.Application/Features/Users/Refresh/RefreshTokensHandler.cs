using Momentum.Application.Features.Users.Abstractions;
using Momentum.Application.Features.Users.Common;
using Momentum.SharedKernel;

namespace Momentum.Application.Features.Users.Refresh;

public sealed class RefreshTokensHandler
{
	private readonly IRefreshTokensUseCase _useCase;

	public RefreshTokensHandler(IRefreshTokensUseCase useCase)
	{
		_useCase = useCase;
	}

	public Task<Result<LoginTokens>> Handle(RefreshRequest request, CancellationToken ct)
	{
		ArgumentNullException.ThrowIfNull(request);
		return _useCase.Handle(request, ct);
	}
}


