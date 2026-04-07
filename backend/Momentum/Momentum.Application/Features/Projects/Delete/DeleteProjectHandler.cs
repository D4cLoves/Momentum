using Momentum.Application.Abstractions.Persistence;
using Momentum.SharedKernel;
using Momentum.Domain.Interfaces;

namespace Momentum.Application.Features.Projects.Delete;

public sealed class DeleteProjectHandler
{
    private readonly IProjectRepository _projectRepository;
    private readonly IUnitOfWork _unitOfWork;

    public DeleteProjectHandler(IProjectRepository projectRepository, IUnitOfWork unitOfWork)
    {
        ArgumentNullException.ThrowIfNull(projectRepository);
        ArgumentNullException.ThrowIfNull(unitOfWork);
        _projectRepository = projectRepository;
        _unitOfWork = unitOfWork;
    }

    public async Task<Result> Handle(Guid id, string userId)
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

        await _projectRepository.DeleteAsync(project);
        await _unitOfWork.SaveChangesAsync();
        return Result.Success();
    }
}


