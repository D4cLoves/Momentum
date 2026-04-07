using Microsoft.AspNetCore.Mvc;
using Momentum.Application.Features.Sessions.Delete;
using Momentum.Core.Common.Auth;
using Momentum.SharedKernel.Http;
using Momentum.Core.EndpointsSettings;

namespace Momentum.Core.Features.Sessions.Delete;

public sealed class Endpoint : IEndpoint
{
    public void MapEndpoint(IEndpointRouteBuilder app)
    {
        app.MapDelete("/api/sessions/{id:guid}", async (
                [FromServices] DeleteSessionHandler handler,
                [FromServices] ICurrentUser user,
                [FromRoute] Guid id) =>
            {
                string? userId = user.UserId;
                if (string.IsNullOrWhiteSpace(userId))
                {
                    return Results.Unauthorized();
                }

                var result = await handler.Handle(id, userId);
                if (!result.IsSuccess)
                {
                    return result.Error.ToHttp();
                }

                return Results.NoContent();
            })
            .RequireAuthorization()
            .WithName("DeleteSession");
    }
}


