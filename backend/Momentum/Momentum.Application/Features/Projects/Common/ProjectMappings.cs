using Momentum.Domain.Entities;

namespace Momentum.Application.Features.Projects.Common;

public static class ProjectMappings
{
    public static ProjectResponse ToResponse(this Project project)
    {
        ArgumentNullException.ThrowIfNull(project);

        return new ProjectResponse(
            project.Id,
            project.AreaId,
            project.Name.Value,
            project.Goal.Value,
            project.PrimaryTask?.Value,
            project.Notes?.Value,
            project.TargetHours,
            project.CreatedAt,
            project.Sessions.Count);
    }
}


