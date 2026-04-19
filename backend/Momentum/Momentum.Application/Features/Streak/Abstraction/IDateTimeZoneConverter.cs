namespace Momentum.Application.Features.Streak.Abstraction;

public interface IDateTimeZoneConverter
{
	DateOnly ToLocalDate(DateTime utcDateTime, string timeZoneId);
}
