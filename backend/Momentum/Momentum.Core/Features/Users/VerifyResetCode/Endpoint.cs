using Microsoft.AspNetCore.Mvc;
using Momentum.Application.Features.Users.VerifyResetCode;
using Momentum.Core.EndpointsSettings;
using Momentum.SharedKernel.Http;

namespace Momentum.Core.Features.Users.VerifyResetCode;

public class Endpoint : IEndpoint
{
	public void MapEndpoint(IEndpointRouteBuilder app)
	{
		app.MapPost("/api/users/verify-reset-code", async (
				[FromServices] VerifyResetCodeHandler handler,
				[FromBody] VerifyResetCodeRequest request,
				CancellationToken ct) =>
			{
				var result = await handler.Handle(request, ct);
				if (!result.IsSuccess)
				{
					return result.Error.ToHttp();
				}

				return Results.Ok(result.Value);
			})
			.AllowAnonymous()
			.WithName("VerifyResetCodeHandler");
	}
}