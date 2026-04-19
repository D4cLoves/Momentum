using Microsoft.AspNetCore.Mvc;
using Momentum.Core.EndpointsSettings;
using Momentum.Application.Features.Users.ForgotPassword;
using Momentum.SharedKernel.Http;

namespace Momentum.Core.Features.Users.ForgotPassword;

public class Endpoint : IEndpoint
{
	public void MapEndpoint(IEndpointRouteBuilder app)
	{
		app.MapPost("/api/users/forgot-password", async (
				[FromServices] ForgotPasswordHandler handler,
				[FromBody] ForgotPasswordRequest request,
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
			.WithName("ForgotPassword");
	}
}
