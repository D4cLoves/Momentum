using Momentum.Application.Abstractions.Persistence;
using Momentum.Application.Features.Sessions.Common;
using Momentum.SharedKernel;
using Momentum.Domain.Interfaces;

namespace Momentum.Application.Features.Sessions.End;

public sealed class EndSessionHandler
{
    private readonly ISessionRepository _sessionRepository;
    private readonly IProjectRepository _projectRepository;
    private readonly IUnitOfWork _unitOfWork;

    public EndSessionHandler(ISessionRepository sessionRepository, IProjectRepository projectRepository, IUnitOfWork unitOfWork)
    {
        ArgumentNullException.ThrowIfNull(sessionRepository);
        ArgumentNullException.ThrowIfNull(projectRepository);
        ArgumentNullException.ThrowIfNull(unitOfWork);

        _sessionRepository = sessionRepository;
        _projectRepository = projectRepository;
        _unitOfWork = unitOfWork;
    }

    public async Task<Result<SessionResponse>> Handle(Guid sessionId, string userId, EndSessionRequest request)
    {
        if (sessionId == Guid.Empty)
        {
            return Errors.ParamNull(nameof(sessionId));
        }

        if (string.IsNullOrWhiteSpace(userId))
        {
            return Errors.AccountNotFound;
        }

        ArgumentNullException.ThrowIfNull(request);

        var session = await _sessionRepository.GetByIdAsync(sessionId);
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

        try
        {
            var endResult = session.End(request.Notes);
            if (!endResult.IsSuccess)
            {
                return endResult.Error;
            }
        }
        catch (ArgumentException ex)
        {
            return Errors.IdentityError(ex.Message);
        }

        await _sessionRepository.UpdateSessionASync(session);
        await _unitOfWork.SaveChangesAsync();
        return session.ToResponse();
    }
}


