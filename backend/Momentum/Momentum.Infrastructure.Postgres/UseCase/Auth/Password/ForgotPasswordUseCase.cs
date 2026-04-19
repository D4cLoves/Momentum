using Momentum.Application.Abstractions.Password;
using Momentum.Application.Features.Users.ForgotPassword;
using Momentum.SharedKernel;

namespace Momentum.Infrastructure.Postgres.Services.Password;

public sealed class ForgotPasswordUseCase(IPasswordService passwordService) : IForgotPasswordUseCase
{
    public Task<Result> Handle(ForgotPasswordRequest request, CancellationToken ct = default)
    {
        ArgumentNullException.ThrowIfNull(request);
        return passwordService.RequestResetAsync(request.Email, ct);
    }
}
