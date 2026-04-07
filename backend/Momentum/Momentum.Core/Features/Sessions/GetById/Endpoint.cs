using Microsoft.AspNetCore.Mvc;
using Momentum.Application.Features.Sessions.GetById;
using Momentum.Core.Common.Auth;
using Momentum.SharedKernel.Http;
using Momentum.Core.EndpointsSettings;

namespace Momentum.Core.Features.Sessions.GetById;

public sealed class Endpoint : IEndpoint
{
    public void MapEndpoint(IEndpointRouteBuilder app)
    {
        app.MapGet("/api/sessions/{id:guid}", async (
                [FromRoute] Guid id,
                GetSessionByIdHandler handler,
                ICurrentUser user) =>
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

                return Results.Ok(result.Value);
            })
            .RequireAuthorization()
            .WithName("GetSessionById");
    }
}


