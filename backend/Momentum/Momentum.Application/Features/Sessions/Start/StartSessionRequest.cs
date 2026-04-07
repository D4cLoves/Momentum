namespace Momentum.Application.Features.Sessions.Start;

public sealed record StartSessionRequest(Guid ProjectId, string Title, string Goal);


