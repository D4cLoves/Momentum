using Momentum.Application.Abstractions.Persistence;
using Momentum.Application.Features.Sessions.Common;
using Momentum.Domain.Entities;
using Momentum.Domain.Interfaces;
using Momentum.SharedKernel;

namespace Momentum.Application.Features.Sessions.Tasks.Create;

public sealed class CreateSessionTaskHandler
{
    private readonly ISessionRepository _sessionRepository;
    private readonly IProjectRepository _projectRepository;
    private readonly IUnitOfWork _unitOfWork;

    public CreateSessionTaskHandler(
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
        CreateSessionTaskRequest request,
        CancellationToken ct = default)
    {
        ArgumentException.ThrowIfNullOrWhiteSpace(userId);
        if (sessionId == Guid.Empty) return Errors.ParamNull(nameof(sessionId));
        if (request is null) return Errors.ParamNull(nameof(request));

        ct.ThrowIfCancellationRequested();

        ProjectSession? session = await _sessionRepository.GetByIdAsync(sessionId);
        if (session is null) return Errors.SessionNotFound;

        Project? project = await _projectRepository.GetByIdAsync(session.ProjectId);
        if (project is null) return Errors.ProjectNotFound;

        if (!string.Equals(project.UserId, userId, StringComparison.Ordinal)) return Errors.AccessDenied;
        if (!session.IsActive) return Errors.SessionNotActive;

        var taskResult = SessionTask.Create(sessionId, request.Description);
        if (!taskResult.IsSuccess) return taskResult.Error;

        await _sessionRepository.AddTaskAsync(taskResult.Value);
        await _unitOfWork.SaveChangesAsync(ct);

        return taskResult.Value.ToResponse();
    }
}

