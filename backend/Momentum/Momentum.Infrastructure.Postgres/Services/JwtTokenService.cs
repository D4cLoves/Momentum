using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Microsoft.Extensions.Options;
using Momentum.Application.Abstractions.Auth;
using Microsoft.IdentityModel.Tokens;
using Momentum.SharedKernel;

namespace Momentum.Infrastructure.Postgres.Services;

public class JwtTokenService : IJwtTokenService
{
	private readonly AuthSettings _authSettings;

	public JwtTokenService(IOptions<AuthSettings> authOptions)
	{
		_authSettings = authOptions.Value;
	}

	public Result<string>  GenerateToken(string userId, string email, IEnumerable<string> roles)
	{
		var claims = new List<Claim>
		{
			new Claim(JwtRegisteredClaimNames.Sub, userId), // Subject (userId)
			new Claim(JwtRegisteredClaimNames.Email, email),
			new Claim(ClaimTypes.NameIdentifier, userId) // Р”РѕРїРѕР»РЅРёС‚РµР»СЊРЅРѕ РґР»СЏ NameId
		};

		foreach (var role in roles)
		{
			claims.Add(new Claim(ClaimTypes.Role, role));
		}

		var signingCredentials = new SigningCredentials(
			new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_authSettings.SecretKey)),
			SecurityAlgorithms.HmacSha256);

		var token = new JwtSecurityToken(
			claims: claims,
			signingCredentials: signingCredentials,
			expires: DateTime.UtcNow.Add(_authSettings.Expires) // РСЃРїРѕР»СЊР·СѓРµРј TimeSpan РёР· РЅР°СЃС‚СЂРѕРµРє
		);

		return new JwtSecurityTokenHandler().WriteToken(token);
	}
}



