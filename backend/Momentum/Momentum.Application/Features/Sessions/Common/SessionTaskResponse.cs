namespace Momentum.Application.Features.Sessions.Common;

public sealed record SessionTaskResponse(
    Guid Id,
    string Description,
    bool IsCompleted,
    DateTime? CompletedAt);


