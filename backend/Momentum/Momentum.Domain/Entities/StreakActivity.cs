namespace Momentum.Domain.Entities;

public sealed class StreakActivity : Entity
{
	public string UserId { get; private set; } = default!;
	public DateOnly ActivityDateLocal { get; private set; }
	public string TimeZoneId { get; private set; } = default!;
	public DateTime OccurredAtUtc { get; private set; }
	public string SourceType { get; private set; } = default!;
	public Guid SourceEventId { get; private set; }
	
	private StreakActivity() { }

	public StreakActivity(
		string userId,
		DateOnly activityDateLocal,
		string timeZoneId,
		DateTime occurredAtUtc,
		string sourceType,
		Guid sourceEventId)
		: base(Guid.NewGuid())
	{
		UserId = userId;
		ActivityDateLocal = activityDateLocal;
		TimeZoneId = timeZoneId;
		OccurredAtUtc = occurredAtUtc;
		SourceType = sourceType;
		SourceEventId = sourceEventId;
	}
}