using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Momentum.Application.Abstractions.Auth;
using Momentum.Application.Abstractions.Password;
using Momentum.Application.Abstractions.Persistence;
using Momentum.Application.Features.Users.Abstractions;
using Momentum.Application.Features.Users.ForgotPassword;
using Momentum.Application.Features.Users.ResetPassword;
using Momentum.Application.Features.Users.VerifyResetCode;
using Momentum.Infrastructure.Postgres.Services;
using Momentum.Infrastructure.Postgres.Services.Password;
using Momentum.Infrastructure.Postgres.Services.Persistence;
using Momentum.Infrastructure.Postgres.Services.Redis;
using StackExchange.Redis;

namespace Momentum.Infrastructure.Postgres.DependencyInjection;

public static class AuthInfrastructureRegistration
{
    public static IServiceCollection AddAuthInfrastructureServices(this IServiceCollection services, IConfiguration configuration)
    {
        string redisConnection = configuration.GetConnectionString("Redis")
            ?? configuration["Redis:ConnectionString"]
            ?? throw new InvalidOperationException("Redis connection string is not configured.");

        services.AddSingleton<IConnectionMultiplexer>(_ => ConnectionMultiplexer.Connect(redisConnection));

        services.AddScoped<IRegisterUserUseCase, RegisterUserUseCase>();
        services.AddScoped<ILoginUserUseCase, LoginUserUseCase>();
        services.AddScoped<IRefreshTokensUseCase, RefreshTokensUseCase>();
        services.AddScoped<IForgotPasswordUseCase, ForgotPasswordUseCase>();
        services.AddScoped<IResetPasswordUseCase, ResetPasswordUseCase>();
        services.AddScoped<IVerifyResetCodeUseCase, VerifyResetCodeUseCase>();

        services.AddScoped<IJwtTokenService, JwtTokenService>();
        services.AddScoped<IRefreshTokenService, RefreshTokenService>();
        services.AddScoped<IPasswordService, PasswordService>();
        services.AddScoped<IRedisServiceResetPassword, RedisServiceResetPassword>();
        services.AddScoped<IResetCodeGeneratorService, ResetCodeGeneratorService>();
        services.AddScoped<IEmailSender, SmtpEmailSender>();


        return services;
    }
}
