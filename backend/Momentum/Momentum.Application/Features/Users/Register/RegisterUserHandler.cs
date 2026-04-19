using Momentum.Application.Features.Users.Abstractions;
using Momentum.SharedKernel;

namespace Momentum.Application.Features.Users.Register;

public sealed class RegisterUserHandler
{
    private readonly IRegisterUserUseCase _useCase;

    public RegisterUserHandler(IRegisterUserUseCase useCase)
    {
        _useCase = useCase;
    }

    public Task<Result> Handle(RegisterUserRequest request, CancellationToken ct = default)
    {
        ArgumentNullException.ThrowIfNull(request);
        return _useCase.Handle(request, ct);
    }
}


