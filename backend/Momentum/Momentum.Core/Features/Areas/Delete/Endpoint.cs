using Microsoft.AspNetCore.Mvc;
using Momentum.Application.Features.Areas.Delete;
using Momentum.Core.Common.Auth;
using Momentum.SharedKernel.Http;
using Momentum.Core.EndpointsSettings;

namespace Momentum.Core.Features.Areas.Delete;

public sealed class Endpoint : IEndpoint
{
    public void MapEndpoint(IEndpointRouteBuilder app)
    {
        app.MapDelete("/api/areas/{id:guid}", async (
                [FromServices] DeleteAreaHandler handler,
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
			.WithName("DeleteArea");
    }
}


