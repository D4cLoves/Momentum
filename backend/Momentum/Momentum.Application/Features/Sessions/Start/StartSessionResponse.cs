using Momentum.Application.Features.Sessions.Common;

namespace Momentum.Application.Features.Sessions.Start;

public sealed record StartSessionResponse(
    Guid Id,
    Guid ProjectId,
    string? Title,
    string? Goal,
    DateTime StartedAt,
    bool IsActive);

public static class StartSessionMappings
{
    public static StartSessionResponse ToStartResponse(this SessionResponse response)
    {
        return new StartSessionResponse(
            response.Id,
            response.ProjectId,
            response.Title,
            response.Goal,
            response.StartedAt,
            response.IsActive);
    }
}


