namespace Momentum.Domain.Entities;

public sealed class UserStreak : Entity
{
	public string UserId { get; private set; } = default!;
	public string TimeZoneId { get; private set; } = "UTC";
	public int CurrentStreak { get; private set; }
	public int BestStreak { get; private set; }
	public DateOnly? LastActivityLocalDate { get; private set; }
	public DateTime? LastCountedAtUtc { get; private set; }
	
	private UserStreak() { }

	public UserStreak(string userId, string timeZoneId)
		: base(Guid.NewGuid())
	{
		UserId = userId;
		TimeZoneId = timeZoneId;
		CurrentStreak = 0;
		BestStreak = 0;
	}
	
	public StreakUpdateResult ApplyActivity(DateOnly activityLocalDate, DateTime countedAtUtc)
	{
		if (LastActivityLocalDate == activityLocalDate)
		{
			return StreakUpdateResult.AlreadyCounted(CurrentStreak, BestStreak);
		}

		bool isContinued = LastActivityLocalDate.HasValue && LastActivityLocalDate.Value.AddDays(1) == activityLocalDate;
		if (LastActivityLocalDate.HasValue && LastActivityLocalDate.Value.AddDays(1) == activityLocalDate)
		{
			CurrentStreak++;
		}
		else
		{
			CurrentStreak = 1;
		}

		if (CurrentStreak > BestStreak)
		{
			BestStreak = CurrentStreak;
		}

		LastActivityLocalDate = activityLocalDate;
		LastCountedAtUtc = countedAtUtc;
		UpdateTimestamp();

		return isContinued
			? StreakUpdateResult.Continued(CurrentStreak, BestStreak)
			: StreakUpdateResult.Restarted(CurrentStreak, BestStreak);
	}

	public void UpdateTimeZone(string timeZoneId)
	{
		TimeZoneId = timeZoneId;
		UpdateTimestamp();
	}

}
