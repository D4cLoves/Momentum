using Momentum.Application.Abstractions.Persistence;
using Momentum.Application.Features.Sessions.Common;
using Momentum.SharedKernel;
using Momentum.Domain.Interfaces;

namespace Momentum.Application.Features.Sessions.Start;

public sealed class StartSessionHandler
{
    private readonly IProjectRepository _projectRepository;
    private readonly ISessionRepository _sessionRepository;
    private readonly IUnitOfWork _unitOfWork;

    public StartSessionHandler(IProjectRepository projectRepository, ISessionRepository sessionRepository, IUnitOfWork unitOfWork)
    {
        ArgumentNullException.ThrowIfNull(projectRepository);
        ArgumentNullException.ThrowIfNull(sessionRepository);
        ArgumentNullException.ThrowIfNull(unitOfWork);

        _projectRepository = projectRepository;
        _sessionRepository = sessionRepository;
        _unitOfWork = unitOfWork;
    }

    public async Task<Result<StartSessionResponse>> Handle(string userId, StartSessionRequest request)
    {
        if (string.IsNullOrWhiteSpace(userId))
        {
            return Errors.AccountNotFound;
        }

        ArgumentNullException.ThrowIfNull(request);

        var project = await _projectRepository.GetByIdAsync(request.ProjectId);
        if (project is null)
        {
            return Errors.ProjectNotFound;
        }

        if (!string.Equals(project.UserId, userId, StringComparison.Ordinal))
        {
            return Errors.AccessDenied;
        }

        var sessionResult = project.StartSession(request.Title, request.Goal);
        if (!sessionResult.IsSuccess)
        {
            return sessionResult.Error;
        }

        await _sessionRepository.AddSessionAsync(sessionResult.Value);
        await _unitOfWork.SaveChangesAsync();
        return sessionResult.Value.ToResponse().ToStartResponse();
    }
}


