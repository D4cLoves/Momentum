namespace Momentum.Application.Features.Projects.Create;

public sealed record CreateProjectRequest(
    Guid AreaId,
    string Name,
    string Goal,
    string? PrimaryTask,
    int? TargetHours,
    string? Notes);


