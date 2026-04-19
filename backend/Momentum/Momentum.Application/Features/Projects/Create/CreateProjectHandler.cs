using Momentum.Application.Abstractions.Persistence;
using Momentum.Application.Features.Projects.Common;
using Momentum.SharedKernel;
using Momentum.Domain.Interfaces;

namespace Momentum.Application.Features.Projects.Create;

public sealed class CreateProjectHandler
{
    private readonly IAreaRepository _areaRepository;
    private readonly IProjectRepository _projectRepository;
    private readonly IUnitOfWork _unitOfWork;

    public CreateProjectHandler(IAreaRepository areaRepository, IProjectRepository projectRepository, IUnitOfWork unitOfWork)
    {
        ArgumentNullException.ThrowIfNull(areaRepository);
        ArgumentNullException.ThrowIfNull(projectRepository);
        ArgumentNullException.ThrowIfNull(unitOfWork);

        _areaRepository = areaRepository;
        _projectRepository = projectRepository;
        _unitOfWork = unitOfWork;
    }

    public async Task<Result<ProjectResponse>> Handle(string userId, CreateProjectRequest request)
    {
        ArgumentException.ThrowIfNullOrWhiteSpace(userId);
        ArgumentNullException.ThrowIfNull(request);

        var area = await _areaRepository.GetByIdAsync(request.AreaId);
        if (area is null)
        {
            return Errors.AreaNotFound;
        }

        if (!string.Equals(area.UserId, userId, StringComparison.Ordinal))
        {
            return Errors.AccessDenied;
        }

        var projectResult = Momentum.Domain.Entities.Project.Create(
            userId,
            request.AreaId,
            request.Name,
            request.Goal,
            request.PrimaryTask,
            request.TargetHours,
            request.Notes);

        if (!projectResult.IsSuccess)
        {
            return projectResult.Error;
        }

        await _projectRepository.AddAsync(projectResult.Value);
        await _unitOfWork.SaveChangesAsync();
        return projectResult.Value.ToResponse();
    }
}


