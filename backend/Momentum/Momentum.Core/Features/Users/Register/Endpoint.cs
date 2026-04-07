using System.Threading;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Routing;
using Momentum.Application.Features.Users.Register;
using Momentum.SharedKernel.Http;
using Momentum.Core.EndpointsSettings;

namespace Momentum.Core.Features.Users.Register;

public class Endpoint : IEndpoint
{
	public void MapEndpoint(IEndpointRouteBuilder app)
	{
		app.MapPost("/api/users/register", async (
				[FromServices] RegisterUserHandler handler,
				[FromBody] RegisterUserRequest request,
				CancellationToken ct) =>
			{
				var result = await handler.Handle(request, ct);
				if (!result.IsSuccess)
				{
					return result.Error.ToHttp();
				}

				return Results.NoContent();
			})
			.AllowAnonymous()
			.WithName("RegisterUser");
	}
}


