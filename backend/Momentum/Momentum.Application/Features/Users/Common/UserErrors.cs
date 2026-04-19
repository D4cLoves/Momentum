using Momentum.SharedKernel;

namespace Momentum.Application.Features.Users.Common;

public static class UserErrors
{
    public static Error EmailAlreadyExists { get; } =
        new("EmailAlreadyExists", ErrorType.Conflict, "User with this email already exists.");

    public static Error InvalidCredentials { get; } =
        new("InvalidCredentials", ErrorType.Unauthorized, "Invalid email or password.");
}



