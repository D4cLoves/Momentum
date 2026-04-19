using Microsoft.AspNetCore.Mvc;
using Momentum.Application.Features.Sessions.Tasks.UpdateStatus;
using Momentum.Core.Common.Auth;
using Momentum.Core.EndpointsSettings;
using Momentum.SharedKernel.Http;

namespace Momentum.Core.Features.Sessions.Tasks.Update;

public sealed class Endpoint : IEndpoint
{
    public void MapEndpoint(IEndpointRouteBuilder app)
    {
        app.MapPatch("/api/sessions/{sessionId:guid}/tasks/{taskId:guid}", async (
                [FromServices] UpdateSessionTaskStatusHandler handler,
                ICurrentUser user,
                [FromRoute] Guid sessionId,
                [FromRoute] Guid taskId,
                [FromBody] UpdateSessionTaskStatusRequest request,
                CancellationToken ct) =>
            {
                string? userId = user.UserId;
                if (string.IsNullOrWhiteSpace(userId))
                {
                    return Results.Unauthorized();
                }

                var result = await handler.Handle(userId, sessionId, taskId, request, ct);
                if (!result.IsSuccess)
                {
                    return result.Error.ToHttp();
                }

                return Results.Ok(result.Value);
            })
            .RequireAuthorization()
            .WithName("UpdateSessionTaskStatus");
    }
}

