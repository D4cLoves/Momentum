namespace Momentum.Application.Features.Sessions.Common;

public sealed record SessionResponse(
    Guid Id,
    Guid ProjectId,
    string? Title,
    string? Goal,
    DateTime StartedAt,
    DateTime? EndedAt,
    TimeSpan Duration,
    string? Notes,
    bool IsActive,
    IReadOnlyList<SessionTaskResponse> Tasks);


