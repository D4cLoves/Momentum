namespace Momentum.Application.Features.Streak.Abstraction;

public interface IUserTimeZoneProvider
{
	Task<string> GetTimeZoneIdAsync(string userId, CancellationToken ct = default);
}
