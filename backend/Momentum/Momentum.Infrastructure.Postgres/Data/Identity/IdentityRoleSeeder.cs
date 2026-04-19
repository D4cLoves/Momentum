using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.DependencyInjection;
using Momentum.SharedKernel;

namespace Momentum.Infrastructure.Data.Identity;

public static class IdentityRoleSeeder
{
	public static async Task SeedRolesAsync(IServiceProvider services)
	{
		var roleManager = services.GetRequiredService<RoleManager<IdentityRole>>();

		string[] roles = [RoleNames.User, RoleNames.Admin];

		foreach (var role in roles)
		{
			if (!await roleManager.RoleExistsAsync(role))
			{
				await roleManager.CreateAsync(new IdentityRole(role));
			}
		}
	}
}



