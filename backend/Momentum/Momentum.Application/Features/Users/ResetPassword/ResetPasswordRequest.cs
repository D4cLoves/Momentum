namespace Momentum.Application.Features.Users.ResetPassword;

public sealed record ResetPasswordRequest(string SessionToken, string NewPassword);
