using Momentum.SharedKernel;

namespace Momentum.SharedKernel.Http;

public static class ResultToHttp
{
	public static IResult ToHttp(this Error error) => error.Type switch
	{
		ErrorType.Validation => Results.BadRequest(error.Description),
		ErrorType.NotFound => Results.NotFound(error.Description),
		ErrorType.Unauthorized => Results.Unauthorized(),
		ErrorType.Conflict => Results.Conflict(error.Description),
		_ => Results.StatusCode(500)
	};
}


