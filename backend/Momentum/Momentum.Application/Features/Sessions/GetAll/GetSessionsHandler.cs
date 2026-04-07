using Momentum.Application.Features.Sessions.Common;
using Momentum.SharedKernel;
using Momentum.Domain.Interfaces;

namespace Momentum.Application.Features.Sessions.GetAll;

public sealed class GetSessionsHandler
{
    private readonly ISessionRepository _sessionRepository;

    public GetSessionsHandler(ISessionRepository sessionRepository)
    {
        ArgumentNullException.ThrowIfNull(sessionRepository);
        _sessionRepository = sessionRepository;
    }

    public async Task<Result<List<SessionResponse>>> Handle(string userId)
    {
        if (string.IsNullOrWhiteSpace(userId))
        {
            return Errors.AccountNotFound;
        }

        var sessions = await _sessionRepository.GetByUserIdAsync(userId);
        List<SessionResponse> response = sessions
            .Select(x => x.ToResponse())
            .ToList();

        return response;
    }
}


