using Momentum.Domain.Entities;

namespace Momentum.Domain.Interfaces;

public interface IStreakActivityRepository
{
	Task<bool> ExistsForDayAsync(string userId, DateOnly activityDateLocal, CancellationToken ct = default);
	Task<bool> ExistsForSourceAsync(
		string userId,
		string sourceType,
		Guid sourceEventId,
		CancellationToken ct = default);

	Task AddAsync(StreakActivity activity, CancellationToken ct = default);
}