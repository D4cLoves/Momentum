using Momentum.Application.Features.Projects.Common;
using Momentum.SharedKernel;
using Momentum.Domain.Interfaces;

namespace Momentum.Application.Features.Projects.GetAll;

public sealed class GetProjectsHandler
{
    private readonly IProjectRepository _projectRepository;

    public GetProjectsHandler(IProjectRepository projectRepository)
    {
        ArgumentNullException.ThrowIfNull(projectRepository);
        _projectRepository = projectRepository;
    }

    public async Task<Result<List<ProjectResponse>>> Handle(string userId)
    {
        if (string.IsNullOrWhiteSpace(userId))
        {
            return Errors.AccountNotFound;
        }

        var projects = await _projectRepository.GetByUserIdAsync(userId);
        List<ProjectResponse> response = projects
            .Select(x => x.ToResponse())
            .ToList();

        return response;
    }
}


