using Microsoft.AspNetCore.Mvc;
using Momentum.Application.Features.Projects.Update;
using Momentum.Core.Common.Auth;
using Momentum.SharedKernel.Http;
using Momentum.Core.EndpointsSettings;

namespace Momentum.Core.Features.Projects.Update;

public sealed class Endpoint : IEndpoint
{
    public void MapEndpoint(IEndpointRouteBuilder app)
    {
        app.MapPatch("/api/projects/{id:guid}", async (
                [FromServices] UpdateProjectHandler handler,
                [FromServices] ICurrentUser user,
                [FromRoute] Guid id,
                [FromBody] UpdateProjectRequest request) =>
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
            .WithName("UpdateProject");
    }
}


