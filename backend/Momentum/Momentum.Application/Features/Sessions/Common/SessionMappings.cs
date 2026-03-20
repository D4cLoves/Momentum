using Momentum.Domain.Entities;

namespace Momentum.Application.Features.Sessions.Common;

public static class SessionMappings
{
    public static SessionTaskResponse ToResponse(this SessionTask task)
    {
        ArgumentNullException.ThrowIfNull(task);
        return new SessionTaskResponse(task.Id, task.Description.Value, task.IsCompleted, task.CompletedAt);
    }

    public static SessionResponse ToResponse(this ProjectSession session)
    {
        ArgumentNullException.ThrowIfNull(session);

        IReadOnlyList<SessionTaskResponse> tasks = session.Tasks
            .Select(x => x.ToResponse())
            .ToList();

        return new SessionResponse(
            session.Id,
            session.ProjectId,
            session.Title?.Value,
            session.Goal?.Value,
            session.StartedAt,
            session.EndedAt,
            session.Duration,
            session.Notes?.Value,
            session.IsActive,
            tasks);
    }
}


