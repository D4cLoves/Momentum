using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.TestHost;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Momentum.Core.Configuration;
using Momentum.Infrastructure.Data.Identity;

namespace Momentum.IntegrationTests;

public sealed class TestApplicationFixture : IAsyncLifetime
{
    private WebApplication? _app;
    public HttpClient Client { get; private set; } = null!;

    public async Task InitializeAsync()
    {
        var builder = WebApplication.CreateBuilder(new WebApplicationOptions
        {
            EnvironmentName = "Testing"
        });

        builder.Configuration.AddInMemoryCollection(new Dictionary<string, string?>
        {
            ["ConnectionStrings:DefaultConnection"] = "Host=localhost;Port=5432;Database=momentum_dev;Username=postgres;Password=postgres",
            ["AuthSettings:SecretKey"] = "mysecretkeymysecretkeymysecretkeymysecretkey",
            ["AuthSettings:Expires"] = "00:30:00",
            ["AuthSettings:RefreshExpires"] = "14.00:00:00",
            ["AuthSettings:RefreshHmacKey"] = "myrefreshsecretkeymyrefreshsecretkeymyrefreshsecretkeymyrefreshsecretkey"
        });

        builder.WebHost.UseTestServer();
        builder.Services.AddConfiguration(builder.Configuration, builder);

        _app = builder.Build();
        _app.Configure();
        await _app.StartAsync();

        await EnsureRolesAsync(_app.Services);
        Client = _app.GetTestClient();
    }

    public async Task DisposeAsync()
    {
        if (_app is not null)
        {
            await _app.StopAsync();
            await _app.DisposeAsync();
        }
    }

    private static async Task EnsureRolesAsync(IServiceProvider services)
    {
        using IServiceScope scope = services.CreateScope();
        var roleManager = scope.ServiceProvider.GetRequiredService<RoleManager<IdentityRole>>();
        await EnsureRoleAsync(roleManager, "User");
        await EnsureRoleAsync(roleManager, "Admin");
    }

    private static async Task EnsureRoleAsync(RoleManager<IdentityRole> roleManager, string roleName)
    {
        if (!await roleManager.RoleExistsAsync(roleName))
        {
            await roleManager.CreateAsync(new IdentityRole(roleName));
        }
    }
}


