using Momentum.Application.Features.Streak.Common;

namespace Momentum.Application.Features.Streak.Abstraction;

public interface IStreakService
{
	Task<StreakDto> RegisterCompletedSessionAsync(
		string userId,
		Guid sessionId,
		DateTime sessionEndedAtUtc,
		CancellationToken ct = default);

	Task<StreakDto> GetCurrentAsync(string userId, CancellationToken ct = default);
}