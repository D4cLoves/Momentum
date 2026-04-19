using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Momentum.Application.Features.Streak.Abstraction;
using Momentum.Application.Abstractions.Persistence;
using Momentum.Domain.Interfaces;
using Momentum.Infrastructure.Data;
using Momentum.Infrastructure.Data.Identity;
using Momentum.Infrastructure.Postgres.Data;
using Momentum.Infrastructure.Repositories;
using Momentum.Infrastructure.Postgres.Services.streak;

namespace Momentum.Infrastructure.Postgres.DependencyInjection;

public static class PersistenceRegistration
{
    public static IServiceCollection AddPersistence(this IServiceCollection services, IConfiguration configuration)
    {
        string connectionString = configuration.GetConnectionString("DefaultConnection")
            ?? throw new InvalidOperationException("Connection string 'DefaultConnection' is not configured.");

        services.AddDbContext<ApplicationDbContext>(options =>
            options.UseNpgsql(connectionString));

        services.AddIdentity<ApplicationUser, IdentityRole>()
            .AddEntityFrameworkStores<ApplicationDbContext>()
            .AddDefaultTokenProviders();

        services.AddScoped<IAreaRepository, AreaRepository>();
        services.AddScoped<IProjectRepository, ProjectRepository>();
        services.AddScoped<ISessionRepository, SessionRepository>();
        services.AddScoped<IUserStreakRepository, UserStreakRepository>();
        services.AddScoped<IStreakActivityRepository, StreakActivityRepository>();
        services.AddScoped<IUserTimeZoneProvider, UserTimeZoneProvider>();
        services.AddScoped<IDateTimeZoneConverter, DateTimeZoneConverter>();
        services.AddScoped<IUnitOfWork, UnitOfWork>();

        return services;
    }
}
