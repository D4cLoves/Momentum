namespace Momentum.Application.Features.Projects.Update;

public sealed record UpdateProjectRequest(
    string? Name,
    string? Goal,
    string? PrimaryTask,
    int? TargetHours,
    string? Notes);


