using Momentum.Application.Features.Users.Common;
using Momentum.Application.Features.Users.Login;
using Momentum.SharedKernel;

namespace Momentum.Application.Features.Users.Abstractions;

public interface ILoginUserUseCase
{
    Task<Result<LoginTokens>> Handle(LoginUserRequest request, CancellationToken ct = default);
}


