using Microsoft.AspNetCore.Mvc;
using Momentum.Application.Features.Areas.UpdateName;
using Momentum.Core.Common.Auth;
using Momentum.SharedKernel.Http;
using Momentum.Core.EndpointsSettings;

namespace Momentum.Core.Features.Areas.UpdateName;

public sealed class Endpoint : IEndpoint
{
    public void MapEndpoint(IEndpointRouteBuilder app)
    {
        app.MapPatch("/api/areas/{id:guid}/name", async (
                [FromServices] UpdateAreaNameHandler handler,
                [FromServices] ICurrentUser user,
                [FromRoute] Guid id,
                [FromBody] UpdateAreaNameRequest request) =>
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
			.WithName("UpdateAreaName");
    }
}


