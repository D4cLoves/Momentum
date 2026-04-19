using Microsoft.EntityFrameworkCore;
using Momentum.Domain.Entities;
using Momentum.Domain.Interfaces;
using Momentum.Infrastructure.Data;

namespace Momentum.Infrastructure.Repositories;

public sealed class UserStreakRepository : IUserStreakRepository
{
	private readonly ApplicationDbContext _context;

	public UserStreakRepository(ApplicationDbContext context)
	{
		ArgumentNullException.ThrowIfNull(context);
		_context = context;
	}

	public async Task<UserStreak?> GetByUserIdAsync(string userId, CancellationToken ct = default)
	{
		if (string.IsNullOrWhiteSpace(userId))
		{
			return null;
		}

		return await _context.UserStreaks
			.AsTracking()
			.FirstOrDefaultAsync(x => x.UserId == userId, ct);
	}

	public Task AddAsync(UserStreak streak, CancellationToken ct = default)
	{
		ArgumentNullException.ThrowIfNull(streak);
		_context.UserStreaks.Add(streak);
		return Task.CompletedTask;
	}

	public Task UpdateAsync(UserStreak streak, CancellationToken ct = default)
	{
		ArgumentNullException.ThrowIfNull(streak);
		_ = streak;
		return Task.CompletedTask;
	}
}