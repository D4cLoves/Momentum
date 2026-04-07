namespace Momentum.Application.Features.Projects.Common;

public sealed record ProjectResponse(
    Guid Id,
    Guid AreaId,
    string Name,
    string Goal,
    string? PrimaryTask,
    string? Notes,
    int? TargetHours,
    DateTime CreatedAt,
    int SessionsCount);


