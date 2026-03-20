using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Routing;
using Momentum.Application.Features.Areas.Create;
using Momentum.Core.Common.Auth;
using Momentum.SharedKernel.Http;
using Momentum.Core.EndpointsSettings;

namespace Momentum.Core.Features.Areas.Create;

public class Endpoint : IEndpoint
{
	public void MapEndpoint(IEndpointRouteBuilder app)
	{
		app.MapPost("/api/areas", async (
				[FromServices] CreateAreaHandler handler,
				[FromServices] ICurrentUser user,
				[FromServices] ILogger<Endpoint> logger,
				HttpContext context,
				[FromBody] CreateAreaRequest request) =>
			{
				string? userId = user.UserId;
				if (string.IsNullOrWhiteSpace(userId))
				{
					bool hasAccessCookie = context.Request.Cookies.ContainsKey("access_token");
					bool hasAuthHeader = context.Request.Headers.ContainsKey("Authorization");
					logger.LogWarning("Unauthorized /api/areas. HasCookie={HasCookie}, HasAuthHeader={HasAuthHeader}", hasAccessCookie, hasAuthHeader);
					return Results.Unauthorized();
				}

				var result = await handler.Handle(userId, request);
				if (!result.IsSuccess)
				{
					return result.Error.ToHttp();
				}

				return Results.Created($"/api/areas/{result.Value.Id}", result.Value);
			})
			.RequireAuthorization()
			.WithName("CreateArea");
	}
}


