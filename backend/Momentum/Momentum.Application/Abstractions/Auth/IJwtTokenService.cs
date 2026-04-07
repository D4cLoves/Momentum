using Momentum.SharedKernel;

namespace Momentum.Application.Abstractions.Auth;

public interface IJwtTokenService
{
    Result<string> GenerateToken(string userId, string email, IEnumerable<string> roles);
}



