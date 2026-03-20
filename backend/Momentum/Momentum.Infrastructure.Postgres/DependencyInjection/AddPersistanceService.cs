using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;

namespace Momentum.Infrastructure.Postgres.DependencyInjection;

[Obsolete("Use PersistenceRegistration.AddPersistence and AuthInfrastructureRegistration.AddAuthInfrastructureServices.")]
public static class AddPersistanceService
{
    public static IServiceCollection AddServices(this IServiceCollection services, IConfiguration configuration)
    {
        services.AddPersistence(configuration);
        services.AddAuthInfrastructureServices();
        return services;
    }
}
