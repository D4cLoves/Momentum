using Momentum.Application.Abstractions.Persistence;
using Momentum.Infrastructure.Data;

namespace Momentum.Infrastructure.Postgres.Data;

public sealed class UnitOfWork(ApplicationDbContext context) : IUnitOfWork
{
    public async Task SaveChangesAsync(CancellationToken ct = default)
    {
        await context.SaveChangesAsync(ct);
    }
}


