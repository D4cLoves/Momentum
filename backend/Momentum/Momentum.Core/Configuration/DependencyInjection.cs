using Microsoft.OpenApi;

using Momentum.Core.EndpointsSettings;
using Momentum.Core.Features.Lessons;

using Serilog;
using Serilog.Exceptions;

namespace Momentum.Core.Configuration;

public static class DependencyInjection
{
    public static IServiceCollection AddConfiguration(this IServiceCollection services, IConfiguration configuration)
    {
        services.AddScoped<CreateHandler>();

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
                    Name = "Vlad", Email = "vladislavvtr12@mail.ru"
                }
            });
        });

        return services;
    }

    public static IServiceCollection AddSerilogLogging(this IServiceCollection services, IConfiguration configuration)
    {
        services.AddSerilog((services, lc) => lc
            .ReadFrom.Configuration(configuration)
            .ReadFrom.Services(services)
            .Enrich.FromLogContext()
            .Enrich.WithExceptionDetails()
            .Enrich.WithProperty("ServiceName", "lessonService"));

        return services;
    }
}
