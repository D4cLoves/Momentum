using Momentum.Domain.Entities;

namespace Momentum.Domain.Interfaces;

public interface IAreaRepository
{
  Task<Area?> GetByIdAsync(Guid id);
  Task<List<Area>> GetByUserIdAsync(string userId);
  Task AddAsync(Area area);
  Task UpdateAsync(Area area);
  Task DeleteAsync(Area area);
}


