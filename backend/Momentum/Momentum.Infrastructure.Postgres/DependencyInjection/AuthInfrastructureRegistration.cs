using Microsoft.Extensions.DependencyInjection;
using Momentum.Application.Abstractions.Auth;
using Momentum.Application.Features.Users.Abstractions;
using Momentum.Infrastructure.Postgres.Services;

namespace Momentum.Infrastructure.Postgres.DependencyInjection;

public static class AuthInfrastructureRegistration
{
    public static IServiceCollection AddAuthInfrastructureServices(this IServiceCollection services)
    {
        services.AddScoped<IRegisterUserUseCase, RegisterUserUseCase>();
        services.AddScoped<ILoginUserUseCase, LoginUserUseCase>();
        services.AddScoped<IRefreshTokensUseCase, RefreshTokensUseCase>();

        services.AddScoped<IJwtTokenService, JwtTokenService>();
        services.AddScoped<IRefreshTokenService, RefreshTokenService>();

        return services;
    }
}
