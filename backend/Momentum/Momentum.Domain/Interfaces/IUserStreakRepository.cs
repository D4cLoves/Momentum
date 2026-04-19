using Momentum.Domain.Entities;

namespace Momentum.Domain.Interfaces;

public interface IUserStreakRepository
{
	Task<UserStreak?> GetByUserIdAsync(string userId, CancellationToken ct = default);
	Task AddAsync(UserStreak streak, CancellationToken ct = default);
	Task UpdateAsync(UserStreak streak, CancellationToken ct = default);
}