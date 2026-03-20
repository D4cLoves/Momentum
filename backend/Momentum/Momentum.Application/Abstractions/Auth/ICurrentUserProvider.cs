namespace Momentum.Application.Abstractions.Auth;

public interface ICurrentUserProvider
{
    string? UserId { get; }
}


