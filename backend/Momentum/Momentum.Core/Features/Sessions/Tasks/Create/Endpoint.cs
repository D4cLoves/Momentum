using Microsoft.AspNetCore.Mvc;
using Momentum.Application.Features.Sessions.Tasks.Create;
using Momentum.Core.Common.Auth;
using Momentum.Core.EndpointsSettings;
using Momentum.SharedKernel.Http;

namespace Momentum.Core.Features.Sessions.Tasks.Create;

public sealed class Endpoint : IEndpoint
{
    public void MapEndpoint(IEndpointRouteBuilder app)
    {
        app.MapPost("/api/sessions/{sessionId:guid}/tasks", async (
                [FromServices] CreateSessionTaskHandler handler,
                ICurrentUser user,
                [FromRoute] Guid sessionId,
                [FromBody] CreateSessionTaskRequest request,
                CancellationToken ct) =>
            {
                string? userId = user.UserId;
                if (string.IsNullOrWhiteSpace(userId))
                {
                    return Results.Unauthorized();
                }

                var result = await handler.Handle(userId, sessionId, request, ct);
                if (!result.IsSuccess)
                {
                    return result.Error.ToHttp();
                }

                return Results.Created($"/api/sessions/{sessionId}/tasks/{result.Value.Id}", result.Value);
            })
            .RequireAuthorization()
            .WithName("CreateSessionTask");
    }
}

