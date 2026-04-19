using Microsoft.OpenApi;
using Momentum.Application.Abstractions.Auth;
using Momentum.Application.DependencyInjection;
using Momentum.Core.Common.Auth;
using Momentum.Core.EndpointsSettings;
using Momentum.Core.Extensions;
using Momentum.Infrastructure.Postgres.DependencyInjection;
using Serilog;
using Serilog.Exceptions;

namespace Momentum.Core.Configuration;

public static class DependencyInjection
{
    public static IServiceCollection AddConfiguration(this IServiceCollection services, IConfiguration configuration, WebApplicationBuilder builder)
    {
        services
            .AddApplicationHandlers()
            .AddPersistence(configuration)
            .AddAuthInfrastructureServices(configuration);

        services.AddHttpContextAccessor();
        services.AddScoped<ICurrentUser, CurrentUser>();
        services.AddScoped<ICurrentUserProvider, CurrentUser>();

        services.Configure<AuthSettings>(builder.Configuration.GetSection("AuthSettings"));
        services.Configure<EmailSettings>(builder.Configuration.GetSection(EmailSettings.SectionName));
        services.AddJwtAuthentication(configuration);

        services
            .AddSerilogLogging(configuration)
            .AddOpenApiSpec()
            .AddEndpoints(typeof(Program).Assembly);

        return services;
    }

    public static IServiceCollection AddOpenApiSpec(this IServiceCollection services)
    {
        services.AddOpenApi();

        services.AddSwaggerGen(options =>
        {
            options.SwaggerDoc("v1", new OpenApiInfo
            {
                Title = "Momentum",
                Version = "v1",
                Contact = new OpenApiContact
                {
                    Name = "Vlad",
                    Email = "vladislavvtr12@mail.ru"
                }
            });
        });

        return services;
    }

    public static IServiceCollection AddSerilogLogging(this IServiceCollection services, IConfiguration configuration)
    {
        services.AddSerilog((serviceProvider, loggerConfiguration) => loggerConfiguration
            .ReadFrom.Configuration(configuration)
            .ReadFrom.Services(serviceProvider)
            .Enrich.FromLogContext()
            .Enrich.WithExceptionDetails()
            .Enrich.WithProperty("ServiceName", "lessonService"));

        return services;
    }
}
