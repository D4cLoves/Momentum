using Microsoft.AspNetCore.Mvc;
using Momentum.Application.Features.Sessions.End;
using Momentum.Core.Common.Auth;
using Momentum.SharedKernel.Http;
using Momentum.Core.EndpointsSettings;

namespace Momentum.Core.Features.Sessions.End;

public sealed class Endpoint : IEndpoint
{
    public void MapEndpoint(IEndpointRouteBuilder app)
    {
        app.MapPatch("/api/sessions/{id:guid}/end", async (
                [FromServices] EndSessionHandler handler,
                [FromServices] ICurrentUser user,
                [FromRoute] Guid id,
                [FromBody] EndSessionRequest request) =>
            {
                string? userId = user.UserId;
                if (string.IsNullOrWhiteSpace(userId))
                {
                    return Results.Unauthorized();
                }

                var result = await handler.Handle(id, userId, request);
                if (!result.IsSuccess)
                {
                    return result.Error.ToHttp();
                }

                return Results.Ok(result.Value);
            })
            .RequireAuthorization()
            .WithName("EndSession");
    }
}


