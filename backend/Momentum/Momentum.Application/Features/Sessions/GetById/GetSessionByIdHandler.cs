using Momentum.Application.Features.Sessions.Common;
using Momentum.SharedKernel;
using Momentum.Domain.Interfaces;

namespace Momentum.Application.Features.Sessions.GetById;

public sealed class GetSessionByIdHandler
{
    private readonly ISessionRepository _sessionRepository;
    private readonly IProjectRepository _projectRepository;

    public GetSessionByIdHandler(ISessionRepository sessionRepository, IProjectRepository projectRepository)
    {
        ArgumentNullException.ThrowIfNull(sessionRepository);
        ArgumentNullException.ThrowIfNull(projectRepository);

        _sessionRepository = sessionRepository;
        _projectRepository = projectRepository;
    }

    public async Task<Result<SessionResponse>> Handle(Guid id, string userId)
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

        return session.ToResponse();
    }
}


