using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Options;
using Momentum.Application.Abstractions.Auth;
using Momentum.Application.Abstractions.Persistence;
using Momentum.Application.Features.Users.Abstractions;
using Momentum.Application.Features.Users.Common;
using Momentum.Application.Features.Users.Login;
using Momentum.SharedKernel;
using Momentum.Infrastructure.Data;
using Momentum.Infrastructure.Data.Identity;
using Momentum.Domain.Entities;

namespace Momentum.Infrastructure.Postgres.Services;

public sealed class LoginUserUseCase(
    UserManager<ApplicationUser> userManager,
    ApplicationDbContext context,
    IUnitOfWork unitOfWork,
    IOptions<AuthSettings> authSettings,
    IJwtTokenService jwtTokenService,
    IRefreshTokenService refreshTokenService) : ILoginUserUseCase
{
    public async Task<Result<LoginTokens>> Handle(LoginUserRequest request, CancellationToken ct = default)
    {
        if (string.IsNullOrWhiteSpace(request.Email))
            return Errors.ParamNull(nameof(request.Email));
        if (string.IsNullOrWhiteSpace(request.Password))
            return Errors.ParamNull(nameof(request.Password));

        if (string.IsNullOrWhiteSpace(authSettings.Value.RefreshHmacKey))
            return Errors.IdentityError("AuthSettings:RefreshHmacKey is required.");

        var user = await userManager.FindByEmailAsync(request.Email);
        if (user == null)
            return UserErrors.InvalidCredentials;

        var isValidPassword = await userManager.CheckPasswordAsync(user, request.Password);
        if (!isValidPassword)
            return UserErrors.InvalidCredentials;

        var roles = await userManager.GetRolesAsync(user);

        var accessTokenResult = jwtTokenService.GenerateToken(user.Id, user.Email ?? request.Email, roles);
        if (accessTokenResult.IsFailure)
            return accessTokenResult.Error;

        var refreshToken = refreshTokenService.CreateRefreshToken();
        var refreshTokenHash = refreshTokenService.HashRefreshToken(refreshToken, authSettings.Value.RefreshHmacKey);

        context.Set<RefreshToken>().Add(new RefreshToken
        {
            Id = Guid.NewGuid(),
            UserId = user.Id,
            TokenHash = refreshTokenHash,
            CreatedAtUtc = DateTime.UtcNow,
            ExpiresAtUtc = DateTime.UtcNow.Add(authSettings.Value.RefreshExpires)
        });

        await unitOfWork.SaveChangesAsync(ct);

        return new LoginTokens(accessTokenResult.Value, refreshToken);
    }
}


