using Momentum.Application.Features.Users.Common;
using Momentum.Application.Features.Users.Refresh;
using Momentum.SharedKernel;

namespace Momentum.Application.Features.Users.Abstractions;

public interface IRefreshTokensUseCase
{
    Task<Result<LoginTokens>> Handle(RefreshRequest request, CancellationToken ct = default);
}


