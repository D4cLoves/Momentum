using Momentum.Application.Features.Projects.Common;
using Momentum.SharedKernel;
using Momentum.Domain.Interfaces;

namespace Momentum.Application.Features.Projects.GetById;

public sealed class GetProjectByIdHandler
{
    private readonly IProjectRepository _projectRepository;

    public GetProjectByIdHandler(IProjectRepository projectRepository)
    {
        ArgumentNullException.ThrowIfNull(projectRepository);
        _projectRepository = projectRepository;
    }

    public async Task<Result<ProjectResponse>> Handle(Guid id, string userId)
    {
        if (id == Guid.Empty)
        {
            return Errors.InvalidAreaId;
        }

        if (string.IsNullOrWhiteSpace(userId))
        {
            return Errors.AccountNotFound;
        }

        var project = await _projectRepository.GetByIdAsync(id);
        if (project is null)
        {
            return Errors.ProjectNotFound;
        }

        if (!string.Equals(project.UserId, userId, StringComparison.Ordinal))
        {
            return Errors.AccessDenied;
        }

        return project.ToResponse();
    }
}


