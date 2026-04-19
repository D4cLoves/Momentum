using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;
using Momentum.Application.Abstractions.Auth;
using Momentum.Application.Abstractions.Persistence;
using Momentum.Application.Features.Users.Abstractions;
using Momentum.Application.Features.Users.Common;
using Momentum.Application.Features.Users.Refresh;
using Momentum.SharedKernel;
using Momentum.Infrastructure.Data;
using Momentum.Infrastructure.Data.Identity;
using Momentum.Domain.Entities;

namespace Momentum.Infrastructure.Postgres.Services;

public sealed class RefreshTokensUseCase(
    UserManager<ApplicationUser> userManager,
    ApplicationDbContext context,
    IUnitOfWork unitOfWork,
    IOptions<AuthSettings> authSettings,
    IJwtTokenService jwtTokenService,
    IRefreshTokenService refreshTokenService) : IRefreshTokensUseCase
{
    public async Task<Result<LoginTokens>> Handle(RefreshRequest request, CancellationToken ct = default)
    {
        if (string.IsNullOrWhiteSpace(request.refreshTokens))
            return AuthErrors.RefreshTokenMissing;

        if (string.IsNullOrWhiteSpace(authSettings.Value.RefreshHmacKey))
            return Errors.IdentityError("AuthSettings:RefreshHmacKey is required.");

        var now = DateTime.UtcNow;
        var refreshHash = refreshTokenService.HashRefreshToken(request.refreshTokens, authSettings.Value.RefreshHmacKey);

        var existing = await context.Set<RefreshToken>()
            .FirstOrDefaultAsync(t => t.TokenHash == refreshHash, ct);

        if (existing == null)
            return AuthErrors.RefreshTokenInvalid;

        if (existing.RevokedAtUtc is not null)
            return AuthErrors.RefreshTokenInvalid;

        if (existing.ExpiresAtUtc <= now)
            return AuthErrors.RefreshTokenExpired;

        var user = await userManager.FindByIdAsync(existing.UserId);
        if (user == null)
            return Errors.AccountNotFound;

        var roles = await userManager.GetRolesAsync(user);
        var accessTokenResult = jwtTokenService.GenerateToken(user.Id, user.Email ?? string.Empty, roles);
        if (accessTokenResult.IsFailure)
            return accessTokenResult.Error;

        existing.RevokedAtUtc = now;

        var newRefreshToken = refreshTokenService.CreateRefreshToken();
        var newRefreshHash = refreshTokenService.HashRefreshToken(newRefreshToken, authSettings.Value.RefreshHmacKey);
        existing.ReplacedByTokenHash = newRefreshHash;

        context.Set<RefreshToken>().Add(new RefreshToken
        {
            Id = Guid.NewGuid(),
            UserId = user.Id,
            TokenHash = newRefreshHash,
            CreatedAtUtc = now,
            ExpiresAtUtc = now.Add(authSettings.Value.RefreshExpires)
        });

        await unitOfWork.SaveChangesAsync(ct);

        return new LoginTokens(accessTokenResult.Value, newRefreshToken);
    }
}


