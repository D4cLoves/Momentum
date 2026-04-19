using Momentum.Application.Features.Streak.Abstraction;

namespace Momentum.Infrastructure.Postgres.Services.streak;

public sealed class DateTimeZoneConverter : IDateTimeZoneConverter
{
	public DateOnly ToLocalDate(DateTime utcDateTime, string timeZoneId)
	{
		if (string.IsNullOrWhiteSpace(timeZoneId))
		{
			throw new ArgumentException("Timezone is required.", nameof(timeZoneId));
		}

		if (utcDateTime.Kind != DateTimeKind.Utc)
		{
			utcDateTime = DateTime.SpecifyKind(utcDateTime, DateTimeKind.Utc);
		}

		var zone = TimeZoneInfo.FindSystemTimeZoneById(timeZoneId);
		var localDateTime = TimeZoneInfo.ConvertTimeFromUtc(utcDateTime, zone);

		return DateOnly.FromDateTime(localDateTime);
	}
}
