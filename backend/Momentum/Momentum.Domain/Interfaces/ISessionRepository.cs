using Momentum.Domain.Entities;

namespace Momentum.Domain.Interfaces;

public interface ISessionRepository
{
	Task<ProjectSession?> GetByIdAsync(Guid id);
	Task<List<ProjectSession>> GetByUserIdAsync(string userId);
	Task AddSessionAsync(ProjectSession session);
	Task UpdateSessionASync(ProjectSession session);
	Task DeleteSessionAsync(ProjectSession session);
}


