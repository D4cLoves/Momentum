using Microsoft.EntityFrameworkCore;
using Momentum.Core.EndpointsSettings;
using Momentum.Infrastructure.Data;
using Serilog;
using Serilog.Events;

namespace Momentum.Core.Configuration;

public static class AppExtensions
{
    public static IApplicationBuilder Configure(this WebApplication app)
    {
        ApplyDatabaseMigrations(app);

        app.UseSerilogRequestLogging(options =>
        {
            options.MessageTemplate = "HTTP {RequestMethod} {RequestPath} => {StatusCode} in {Elapsed:0.0000} ms";

            options.GetLevel = (httpContext, elapsed, ex) =>
            {
                if (ex is not null || httpContext.Response.StatusCode >= 500)
                {
                    return LogEventLevel.Error;
                }

                if (httpContext.Response.StatusCode >= 400)
                {
                    return LogEventLevel.Warning;
                }

                if (elapsed > 1000)
                {
                    return LogEventLevel.Warning;
                }

                return LogEventLevel.Information;
            };
        });

        app.UseSwagger();
        app.UseSwaggerUI(options =>
        {
            options.ConfigObject.AdditionalItems["withCredentials"] = true;
        });

        app.UseHttpsRedirection();

        app.UseAuthentication();
        app.UseAuthorization();

        app.MapEndpoints();

        return app;
    }

    private static void ApplyDatabaseMigrations(WebApplication app)
    {
        const int maxAttempts = 10;
        TimeSpan delay = TimeSpan.FromSeconds(3);

        for (int attempt = 1; attempt <= maxAttempts; attempt++)
        {
            try
            {
                using IServiceScope scope = app.Services.CreateScope();
                ApplicationDbContext dbContext = scope.ServiceProvider.GetRequiredService<ApplicationDbContext>();
                dbContext.Database.Migrate();
                Log.Information("Database migrations applied successfully");
                return;
            }
            catch (Exception ex) when (attempt < maxAttempts)
            {
                Log.Warning(ex,
                    "Failed to apply database migrations on attempt {Attempt}/{MaxAttempts}. Retrying in {DelaySeconds} seconds...",
                    attempt,
                    maxAttempts,
                    delay.TotalSeconds);
                Thread.Sleep(delay);
            }
        }

        using IServiceScope finalScope = app.Services.CreateScope();
        ApplicationDbContext finalDbContext = finalScope.ServiceProvider.GetRequiredService<ApplicationDbContext>();
        finalDbContext.Database.Migrate();
    }
}

