using Microsoft.AspNetCore.Mvc;
using Momentum.Application.Features.Sessions.Tasks.Delete;
using Momentum.Core.Common.Auth;
using Momentum.Core.EndpointsSettings;
using Momentum.SharedKernel.Http;

namespace Momentum.Core.Features.Sessions.Tasks.Delete;

public sealed class Endpoint : IEndpoint
{
    public void MapEndpoint(IEndpointRouteBuilder app)
    {
        app.MapDelete("/api/sessions/{sessionId:guid}/tasks/{taskId:guid}", async (
                [FromServices] DeleteSessionTaskHandler handler,
                ICurrentUser user,
                [FromRoute] Guid sessionId,
                [FromRoute] Guid taskId,
                CancellationToken ct) =>
            {
                string? userId = user.UserId;
                if (string.IsNullOrWhiteSpace(userId))
                {
                    return Results.Unauthorized();
                }

                var result = await handler.Handle(userId, sessionId, taskId, ct);
                if (!result.IsSuccess)
                {
                    return result.Error.ToHttp();
                }

                return Results.NoContent();
            })
            .RequireAuthorization()
            .WithName("DeleteSessionTask");
    }
}

