namespace Momentum.Application.Features.Sessions.Start;

public sealed record StartSessionResponse(
    Guid Id,
    Guid ProjectId,
    string? Title,
    string? Goal,
    DateTime StartedAt,
    bool IsActive);