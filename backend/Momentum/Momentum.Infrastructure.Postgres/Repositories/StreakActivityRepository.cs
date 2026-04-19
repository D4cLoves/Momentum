using Microsoft.EntityFrameworkCore;
using Momentum.Domain.Entities;
using Momentum.Domain.Interfaces;
using Momentum.Infrastructure.Data;

namespace Momentum.Infrastructure.Repositories;

public sealed class StreakActivityRepository : IStreakActivityRepository
{
	private readonly ApplicationDbContext _context;

	public StreakActivityRepository(ApplicationDbContext context)
	{
		ArgumentNullException.ThrowIfNull(context);
		_context = context;
	}

	public async Task<bool> ExistsForDayAsync(
		string userId,
		DateOnly activityDateLocal,
		CancellationToken ct = default)
	{
		if (string.IsNullOrWhiteSpace(userId))
		{
			return false;
		}

		return await _context.StreakActivities
			.AsNoTracking()
			.AnyAsync(
				x => x.UserId == userId &&
				     x.ActivityDateLocal == activityDateLocal,
				ct);
	}

	public async Task<bool> ExistsForSourceAsync(
		string userId,
		string sourceType,
		Guid sourceEventId,
		CancellationToken ct = default)
	{
		if (string.IsNullOrWhiteSpace(userId) ||
		    string.IsNullOrWhiteSpace(sourceType) ||
		    sourceEventId == Guid.Empty)
		{
			return false;
		}

		return await _context.StreakActivities
			.AsNoTracking()
			.AnyAsync(
				x => x.UserId == userId &&
				     x.SourceType == sourceType &&
				     x.SourceEventId == sourceEventId,
				ct);
	}

	public Task AddAsync(StreakActivity activity, CancellationToken ct = default)
	{
		ArgumentNullException.ThrowIfNull(activity);
		_context.StreakActivities.Add(activity);
		return Task.CompletedTask;
	}
}