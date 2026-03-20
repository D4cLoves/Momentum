using Momentum.Application.Abstractions.Persistence;
using Momentum.SharedKernel;
using Momentum.Domain.Interfaces;

namespace Momentum.Application.Features.Sessions.Delete;

public sealed class DeleteSessionHandler
{
    private readonly ISessionRepository _sessionRepository;
    private readonly IProjectRepository _projectRepository;
    private readonly IUnitOfWork _unitOfWork;

    public DeleteSessionHandler(ISessionRepository sessionRepository, IProjectRepository projectRepository, IUnitOfWork unitOfWork)
    {
        ArgumentNullException.ThrowIfNull(sessionRepository);
        ArgumentNullException.ThrowIfNull(projectRepository);
        ArgumentNullException.ThrowIfNull(unitOfWork);

        _sessionRepository = sessionRepository;
        _projectRepository = projectRepository;
        _unitOfWork = unitOfWork;
    }

    public async Task<Result> Handle(Guid id, string userId)
    {
        if (id == Guid.Empty)
        {
            return Errors.ParamNull(nameof(id));
        }

        if (string.IsNullOrWhiteSpace(userId))
        {
            return Errors.AccountNotFound;
        }

        var session = await _sessionRepository.GetByIdAsync(id);
        if (session is null)
        {
            return Errors.SessionNotFound;
        }

        var project = await _projectRepository.GetByIdAsync(session.ProjectId);
        if (project is null)
        {
            return Errors.ProjectNotFound;
        }

        if (!string.Equals(project.UserId, userId, StringComparison.Ordinal))
        {
            return Errors.AccessDenied;
        }

        await _sessionRepository.DeleteSessionAsync(session);
        await _unitOfWork.SaveChangesAsync();
        return Result.Success();
    }
}


