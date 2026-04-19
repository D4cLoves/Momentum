using Momentum.Application.Abstractions.Persistence;
using Momentum.Application.Features.Projects.Common;
using Momentum.SharedKernel;
using Momentum.Domain.ValueObjects;
using Momentum.Domain.Interfaces;

namespace Momentum.Application.Features.Projects.Update;

public sealed class UpdateProjectHandler
{
    private readonly IProjectRepository _projectRepository;
    private readonly IUnitOfWork _unitOfWork;

    public UpdateProjectHandler(IProjectRepository projectRepository, IUnitOfWork unitOfWork)
    {
        ArgumentNullException.ThrowIfNull(projectRepository);
        ArgumentNullException.ThrowIfNull(unitOfWork);
        _projectRepository = projectRepository;
        _unitOfWork = unitOfWork;
    }

    public async Task<Result<ProjectResponse>> Handle(Guid id, string userId, UpdateProjectRequest request)
    {
        if (id == Guid.Empty)
        {
            return Errors.InvalidAreaId;
        }

        if (string.IsNullOrWhiteSpace(userId))
        {
            return Errors.AccountNotFound;
        }

        ArgumentNullException.ThrowIfNull(request);

        var project = await _projectRepository.GetByIdAsync(id);
        if (project is null)
        {
            return Errors.ProjectNotFound;
        }

        if (!string.Equals(project.UserId, userId, StringComparison.Ordinal))
        {
            return Errors.AccessDenied;
        }

        try
        {
            if (request.Name is not null)
            {
                var updateName = project.UpdateName(new NameValue(request.Name));
                if (!updateName.IsSuccess)
                {
                    return updateName.Error;
                }
            }

            if (request.Goal is not null)
            {
                var updateGoal = project.UpdateGoal(new NameValue(request.Goal));
                if (!updateGoal.IsSuccess)
                {
                    return updateGoal.Error;
                }
            }

            if (request.PrimaryTask is not null)
            {
                var updatePrimaryTask = project.UpdatePrimaryTask(request.PrimaryTask);
                if (!updatePrimaryTask.IsSuccess)
                {
                    return updatePrimaryTask.Error;
                }
            }

            if (request.TargetHours.HasValue)
            {
                var updateTargetHours = project.UpdateTargetHours(request.TargetHours);
                if (!updateTargetHours.IsSuccess)
                {
                    return updateTargetHours.Error;
                }
            }

            if (request.Notes is not null)
            {
                ProjectNotes? notes = string.IsNullOrWhiteSpace(request.Notes)
                    ? null
                    : new ProjectNotes(request.Notes);
                project.UpdateNotes(notes);
            }
        }
        catch (ArgumentException ex)
        {
            return Errors.IdentityError(ex.Message);
        }

        await _projectRepository.UpdateAsync(project);
        await _unitOfWork.SaveChangesAsync();
        return project.ToResponse();
    }
}


