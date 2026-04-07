using Microsoft.EntityFrameworkCore;
using Momentum.Domain.Entities;
using Momentum.Infrastructure.Data;
using Momentum.Domain.Interfaces;

namespace Momentum.Infrastructure.Repositories;

public class AreaRepository : IAreaRepository
{
  private readonly ApplicationDbContext _context;

  public AreaRepository(ApplicationDbContext context)
  {
    _context = context;
  }

  public async Task<Area?> GetByIdAsync(Guid id)
  {
    return await _context.Areas
      .Include(a => a.Projects)
      .ThenInclude(p => p.Sessions)
      .FirstOrDefaultAsync(a => a.Id == id);
  }

  public async Task<List<Area>> GetByUserIdAsync(string userId)
  {
    return await _context.Areas
      .Include(a => a.Projects)
      .ThenInclude(p => p.Sessions)
      .Where(a => a.UserId == userId)
      .OrderByDescending(a => a.CreatedAt)
      .ToListAsync();
  }

  public async Task AddAsync(Area area)
  {
    await _context.Areas.AddAsync(area);
  }

  public async Task UpdateAsync(Area area)
  {
    _context.Areas.Update(area);
  }

  public async Task DeleteAsync(Area area)
  {
    _context.Areas.Remove(area);
  }
}


