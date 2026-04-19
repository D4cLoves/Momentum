using Momentum.Application.Abstractions.Password;
using Momentum.Application.Features.Users.Abstractions;
using Momentum.Application.Features.Users.ResetPassword;
using Momentum.SharedKernel;

namespace Momentum.Infrastructure.Postgres.Services.Password;

public sealed class ResetPasswordUseCase : IResetPasswordUseCase
{
	private readonly IPasswordService _passwordService;
	
	public ResetPasswordUseCase(IPasswordService passwordService)
	{
		_passwordService = passwordService;
	}
	
	public Task<Result> Handle(ResetPasswordRequest request, CancellationToken ct = default)
	{
		ArgumentNullException.ThrowIfNull(request);
		return _passwordService.ResetPasswordAsync(request.SessionToken, request.NewPassword, ct);
	}
}
