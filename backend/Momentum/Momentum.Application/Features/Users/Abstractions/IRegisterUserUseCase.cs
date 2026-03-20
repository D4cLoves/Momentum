using Momentum.Application.Features.Users.Register;
using Momentum.SharedKernel;

namespace Momentum.Application.Features.Users.Abstractions;

public interface IRegisterUserUseCase
{
    Task<Result> Handle(RegisterUserRequest request, CancellationToken ct = default);
}


