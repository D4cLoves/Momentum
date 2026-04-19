namespace Momentum.Application.Features.Streak.Common;

public sealed record StreakDto(
	int CurrentStreak,
	int BestStreak,
	DateOnly? LastActivityLocalDate,
	DateOnly? NextExpectedActivityDate,
	string TimeZoneId,
	bool IsCompletedToday,
	bool IsBroken);
