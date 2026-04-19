namespace Momentum.Application.Features.Users.VerifyResetCode;

public sealed record VerifyResetCodeRequest(string Code, string Email);
