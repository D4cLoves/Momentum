using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using Momentum.Application.Abstractions.Auth;

namespace Momentum.Core.Common.Auth;

public sealed class CurrentUser(IHttpContextAccessor accessor) : ICurrentUser, ICurrentUserProvider
{
	public string? UserId =>
		accessor.HttpContext?.User.FindFirstValue(ClaimTypes.NameIdentifier)
		?? accessor.HttpContext?.User.FindFirstValue(JwtRegisteredClaimNames.Sub)
		?? accessor.HttpContext?.User.FindFirstValue("nameid");
}


