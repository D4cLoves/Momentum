namespace Momentum.Domain.Entities;

public sealed record StreakUpdateResult(
	StreakUpdateStatus Status,
	int CurrentStreak,
	int BestStreak)
{
	public static StreakUpdateResult AlreadyCounted(int current, int best) =>
		new(StreakUpdateStatus.AlreadyCounted, current, best);

	public static StreakUpdateResult Continued(int current, int best) =>
		new(StreakUpdateStatus.Continued, current, best);

	public static StreakUpdateResult Restarted(int current, int best) =>
		new(StreakUpdateStatus.Restarted, current, best);
}