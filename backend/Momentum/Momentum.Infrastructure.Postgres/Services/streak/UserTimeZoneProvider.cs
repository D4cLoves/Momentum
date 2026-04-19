using Microsoft.AspNetCore.Identity;
using Momentum.Application.Features.Streak.Abstraction;
using Momentum.Infrastructure.Data.Identity;

namespace Momentum.Infrastructure.Postgres.Services.streak;

public sealed class UserTimeZoneProvider : IUserTimeZoneProvider
{
	private readonly UserManager<ApplicationUser> _userManager;

	public UserTimeZoneProvider(UserManager<ApplicationUser> userManager)
	{
		_userManager = userManager;
	}

	public async Task<string> GetTimeZoneIdAsync(string userId, CancellationToken ct = default)
	{
		if (string.IsNullOrWhiteSpace(userId))
		{
			throw new ArgumentException("User id is required.", nameof(userId));
		}

		var user = await _userManager.FindByIdAsync(userId);
		if (user is null)
		{
			throw new InvalidOperationException($"User '{userId}' was not found.");
		}

		return string.IsNullOrWhiteSpace(user.TimeZoneId)
			? "UTC"
			: user.TimeZoneId;
	}
}