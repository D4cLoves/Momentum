using Momentum.Application.Abstractions.Persistence;
using Momentum.Application.Features.Sessions.Common;
using Momentum.Domain.Entities;
using Momentum.Domain.Interfaces;
using Momentum.SharedKernel;
using System.Linq;

namespace Momentum.Application.Features.Sessions.Tasks.UpdateStatus;

public sealed class UpdateSessionTaskStatusHandler
{
    private readonly ISessionRepository _sessionRepository;
    private readonly IProjectRepository _projectRepository;
    private readonly IUnitOfWork _unitOfWork;

    public UpdateSessionTaskStatusHandler(
        ISessionRepository sessionRepository,
        IProjectRepository projectRepository,
        IUnitOfWork unitOfWork)
    {
        ArgumentNullException.ThrowIfNull(sessionRepository);
        ArgumentNullException.ThrowIfNull(projectRepository);
        ArgumentNullException.ThrowIfNull(unitOfWork);

        _sessionRepository = sessionRepository;
        _projectRepository = projectRepository;
        _unitOfWork = unitOfWork;
    }

    public async Task<Result<SessionTaskResponse>> Handle(
        string userId,
        Guid sessionId,
        Guid taskId,
        UpdateSessionTaskStatusRequest request,
        CancellationToken ct = default)
    {
        ArgumentException.ThrowIfNullOrWhiteSpace(userId);
        if (sessionId == Guid.Empty) return Errors.ParamNull(nameof(sessionId));
        if (taskId == Guid.Empty) return Errors.ParamNull(nameof(taskId));
        ArgumentNullException.ThrowIfNull(request);

        ct.ThrowIfCancellationRequested();

        ProjectSession? session = await _sessionRepository.GetByIdAsync(sessionId);
        if (session is null) return Errors.SessionNotFound;

        Project? project = await _projectRepository.GetByIdAsync(session.ProjectId);
        if (project is null) return Errors.ProjectNotFound;

        if (!string.Equals(project.UserId, userId, StringComparison.Ordinal)) return Errors.AccessDenied;
        if (!session.IsActive) return Errors.SessionNotActive;

        SessionTask? task = session.Tasks.FirstOrDefault(t => t.Id == taskId);
        if (task is null) return Errors.TaskNotFound;

        if (request.IsCompleted)
        {
            var completeResult = task.Complete();
            if (!completeResult.IsSuccess) return completeResult.Error;
        }
        else
        {
            task.Reopen();
        }

        await _sessionRepository.UpdateSessionASync(session);
        await _unitOfWork.SaveChangesAsync(ct);

        return task.ToResponse();
    }
}

