using Microsoft.AspNetCore.Mvc;
using Momentum.Application.Features.Sessions.Start;
using Momentum.Core.Common.Auth;
using Momentum.SharedKernel.Http;
using Momentum.Core.EndpointsSettings;

namespace Momentum.Core.Features.Sessions.Start;

public sealed class Endpoint : IEndpoint
{
    public void MapEndpoint(IEndpointRouteBuilder app)
    {
        app.MapPost("/api/sessions", async (
                [FromServices] StartSessionHandler handler,
                [FromServices] ICurrentUser user,
                [FromBody] StartSessionRequest request) =>
            {
                string? userId = user.UserId;
                if (string.IsNullOrWhiteSpace(userId))
                {
                    return Results.Unauthorized();
                }

                var result = await handler.Handle(userId, request);
                if (!result.IsSuccess)
                {
                    return result.Error.ToHttp();
                }

                return Results.Created($"/api/sessions/{result.Value.Id}", result.Value);
            })
            .RequireAuthorization()
            .WithName("StartSession");
    }
}


