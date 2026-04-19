using Microsoft.AspNetCore.Mvc;
using Momentum.Application.Features.Users.ResetPassword;
using Momentum.Core.EndpointsSettings;
using Momentum.SharedKernel.Http;

namespace Momentum.Core.Features.Users.ResetPassword;

public class Endpoint : IEndpoint
{
	public void MapEndpoint(IEndpointRouteBuilder app)
	{
		app.MapPost("/api/users/reset-password", async (
				[FromServices] ResetPasswordHandler handler,
				[FromBody] ResetPasswordRequest request,
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
			.WithName("ResetPassword");
	}
}
