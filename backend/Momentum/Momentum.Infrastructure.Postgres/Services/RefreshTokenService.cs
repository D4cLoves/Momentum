using System.Security.Cryptography;
using System.Text;
using Momentum.Application.Abstractions.Auth;

namespace Momentum.Infrastructure.Postgres.Services;

public class RefreshTokenService : IRefreshTokenService
{
	public string CreateRefreshToken() => Convert.ToBase64String(RandomNumberGenerator.GetBytes(64));  
  
	public string HashRefreshToken(string refreshToken, string refreshHmacKey)  
	{       
		var key = Encoding.UTF8.GetBytes(refreshHmacKey);
		using var hmac = new HMACSHA256(key);  
		var hash = hmac.ComputeHash(Encoding.UTF8.GetBytes(refreshToken));  
		return Convert.ToBase64String(hash);  
	}  
}



