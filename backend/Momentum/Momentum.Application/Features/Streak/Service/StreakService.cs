using Momentum.Application.Features.Streak.Abstraction;
using Momentum.Application.Features.Streak.Common;
using Momentum.Domain.Entities;
using Momentum.Domain.Interfaces;

namespace Momentum.Application.Features.Streak.Service;

public class StreakService : IStreakService
{
	private readonly IUserStreakRepository _userStreakRepository;
	private readonly IStreakActivityRepository _streakActivityRepository;
	private readonly IUserTimeZoneProvider _timeZoneProvider;
	private readonly IDateTimeZoneConverter _zoneConverter;
	
	public StreakService(
		IUserStreakRepository userStreakRepository,
		IStreakActivityRepository streakActivityRepository,
		IUserTimeZoneProvider timeZoneProvider,
		IDateTimeZoneConverter zoneConverter)
	{
		_userStreakRepository = userStreakRepository;
		_streakActivityRepository = streakActivityRepository;
		_timeZoneProvider = timeZoneProvider;
		_zoneConverter = zoneConverter;
	}
	
	public async Task<StreakDto> RegisterCompletedSessionAsync(
        string userId,
        Guid sessionId,
        DateTime sessionEndedAtUtc,
        CancellationToken ct = default)
    {
        var timeZoneId = await _timeZoneProvider.GetTimeZoneIdAsync(userId, ct);
        var localDate = _zoneConverter.ToLocalDate(sessionEndedAtUtc, timeZoneId);

        var streak = await _userStreakRepository.GetByUserIdAsync(userId, ct);
        if (streak is null)
        {
            streak = new UserStreak(userId, timeZoneId);
            await _userStreakRepository.AddAsync(streak, ct);
        }
        else if (!string.Equals(streak.TimeZoneId, timeZoneId, StringComparison.Ordinal))
        {
            streak.UpdateTimeZone(timeZoneId);
            await _userStreakRepository.UpdateAsync(streak, ct);
        }

        var alreadyCounted = await _streakActivityRepository.ExistsForSourceAsync(
            userId, "SessionCompleted", sessionId, ct);

        if (alreadyCounted)
        {
            return Map(streak, localDate, timeZoneId);
        }

        var dayAlreadyCounted = await _streakActivityRepository.ExistsForDayAsync(userId, localDate, ct);
        if (!dayAlreadyCounted)
        {
            var activity = new StreakActivity(
                userId,
                localDate,
                timeZoneId,
                sessionEndedAtUtc,
                "SessionCompleted",
                sessionId);

            await _streakActivityRepository.AddAsync(activity, ct);
            streak.ApplyActivity(localDate, sessionEndedAtUtc);
            await _userStreakRepository.UpdateAsync(streak, ct);
        }

        return Map(streak, localDate, timeZoneId);
    }

    public async Task<StreakDto> GetCurrentAsync(string userId, CancellationToken ct = default)
    {
        var timeZoneId = await _timeZoneProvider.GetTimeZoneIdAsync(userId, ct);
        var streak = await _userStreakRepository.GetByUserIdAsync(userId, ct)
            ?? new UserStreak(userId, timeZoneId);
        var todayLocal = _zoneConverter.ToLocalDate(DateTime.UtcNow, timeZoneId);

        return Map(streak, todayLocal, timeZoneId);
    }

    private static StreakDto Map(UserStreak streak, DateOnly todayLocal, string timeZoneId)
    {
        var isCompletedToday = streak.LastActivityLocalDate == todayLocal;
        var isBroken =
            streak.LastActivityLocalDate.HasValue &&
            streak.LastActivityLocalDate.Value.AddDays(1) < todayLocal;

        var nextExpected = isCompletedToday ? todayLocal.AddDays(1) : todayLocal;

        return new StreakDto(
            streak.CurrentStreak,
            streak.BestStreak,
            streak.LastActivityLocalDate,
            nextExpected,
            timeZoneId,
            isCompletedToday,
            isBroken);
    }
}
