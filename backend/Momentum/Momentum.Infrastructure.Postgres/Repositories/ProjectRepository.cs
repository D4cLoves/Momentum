using Microsoft.EntityFrameworkCore;
using Momentum.Domain.Entities;
using Momentum.Domain.Interfaces;
using Momentum.Infrastructure.Data;

namespace Momentum.Infrastructure.Repositories;

public class ProjectRepository : IProjectRepository
{
  private readonly ApplicationDbContext _context;

  public ProjectRepository(ApplicationDbContext context)
  {
    _context = context;
  }

  public async Task<Project?> GetByIdAsync(Guid id)
  {
    return await _context.Projects
      .Include(p => p.Sessions)
      .ThenInclude(s => s.Tasks)
      .FirstOrDefaultAsync(p => p.Id == id);
  }

  public async Task<List<Project>> GetByUserIdAsync(string userId)
  {
    return await _context.Projects
      .Include(p => p.Sessions)
      .ThenInclude(s => s.Tasks)
      .Where(p => p.UserId == userId)
      .OrderByDescending(p => p.CreatedAt)
      .ToListAsync();
  }

  public async Task AddAsync(Project project)
  {
    await _context.Projects.AddAsync(project);
  }

  public async Task UpdateAsync(Project project)
  {
    if (_context.Entry(project).State == EntityState.Detached)
    {
      _context.Projects.Attach(project);
    }
    await Task.CompletedTask;
  }

  public async Task DeleteAsync(Project project)
  {
    _context.Projects.Remove(project);
    await Task.CompletedTask;
  }
}


