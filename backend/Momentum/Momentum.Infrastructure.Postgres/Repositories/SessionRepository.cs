using Microsoft.EntityFrameworkCore;
using Momentum.Infrastructure.Data;
using Momentum.Domain.Entities;
using Momentum.Domain.Interfaces;

namespace Momentum.Infrastructure.Repositories;

public class SessionRepository : ISessionRepository
{
	private readonly ApplicationDbContext _context;

	public SessionRepository(ApplicationDbContext context)
	{
		_context = context;
	}

	public async Task<ProjectSession?> GetByIdAsync(Guid id)
	{
		return await _context.ProjectSessions
			.Include(s => s.Tasks)
			.FirstOrDefaultAsync(s => s.Id == id);
	}

	public async Task<List<ProjectSession>> GetByUserIdAsync(string userId)
	{
		return await _context.ProjectSessions
			.Include(s => s.Tasks)
			.Where(s => _context.Projects.Any(p => p.Id == s.ProjectId && p.UserId == userId))
			.OrderByDescending(s => s.StartedAt)
			.ToListAsync();
	}

	public async Task AddSessionAsync(ProjectSession session)
	{
		_context.ProjectSessions.Add(session);
		await Task.CompletedTask;
	}

	public async Task UpdateSessionASync(ProjectSession session)
	{
		_context.ProjectSessions.Attach(session);
		await Task.CompletedTask;
	}

	public async Task DeleteSessionAsync(ProjectSession session)
	{
		_context.ProjectSessions.Remove(session);
		await Task.CompletedTask;
	}
}


