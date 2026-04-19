using System.Security.Cryptography;
using System.Text;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using Momentum.Application.Abstractions.Ent;
using Momentum.Application.Abstractions.Password;
using Momentum.Application.Abstractions.Persistence;
using Momentum.Infrastructure.Data.Identity;
using Momentum.SharedKernel;

namespace Momentum.Infrastructure.Postgres.Services.Password;

public sealed class PasswordService(
	UserManager<ApplicationUser> userManager,
	IRedisServiceResetPassword passwordResetStore,
	IResetCodeGeneratorService codeGeneratorService,
	IEmailSender emailSender,
	ILogger<PasswordService> logger
	) : IPasswordService
{
	public async Task<Result> RequestResetAsync(string email, CancellationToken ct)
	{
		if (string.IsNullOrWhiteSpace(email))
			return Result.Failure(Errors.ParamNull(nameof(email)));
		
		var normalizedEmail = email.Trim().ToUpperInvariant();

		var rl = await passwordResetStore.EnsureRequestRateLimitAsync(normalizedEmail, ct);
		if (rl.IsFailure)
			return rl;

		var user = await userManager.Users.FirstOrDefaultAsync(x => x.NormalizedEmail == normalizedEmail, ct);
		
		if (user is null)
		{
			logger.LogInformation("Forgot-password requested for non-existent email {Email}", normalizedEmail);
			await Task.Delay(Random.Shared.Next(80, 180), ct);
			return Result.Success();
		}

		var code = codeGeneratorService.CodeGenerator(6);
		var challenge = PasswordResetChallenge.Create(
			userId: user.Id,
			normalizedEmail: normalizedEmail,
			plainCode: code,
			expiresAtUtc: DateTime.UtcNow.AddMinutes(10));

		await passwordResetStore.SaveChallengeAsync(challenge, ct);

		if (!string.IsNullOrWhiteSpace(user.Email))
		{
			var subject = "Password reset code";
			var htmlBody = BuildPasswordResetHtml(code, challenge.ExpiresAtUtc);

			try
			{
				logger.LogInformation("Sending password reset email to {Email}", user.Email);
				await emailSender.SendAsync(user.Email, subject, htmlBody, ct);
				logger.LogInformation("Password reset email sent to {Email}", user.Email);
			}
			catch (Exception ex)
			{
				logger.LogError(ex, "Failed to send password reset code to {Email}", user.Email);
			}
		}
		
		return Result.Success();
	}

	private static string BuildPasswordResetHtml(string code, DateTime expiresAtUtc)
	{
		var expiresAtText = expiresAtUtc.ToString("dd MMM yyyy, HH:mm 'UTC'");

		return $"""
		        <!doctype html>
		        <html lang="en">
		        <head>
		          <meta charset="utf-8" />
		          <meta name="viewport" content="width=device-width, initial-scale=1" />
		          <title>Password Reset</title>
		        </head>
		        <body style="margin:0;padding:0;background:#f4f6fb;font-family:Arial,'Segoe UI',sans-serif;color:#0f172a;">
		          <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:#f4f6fb;padding:24px 12px;">
		            <tr>
		              <td align="center">
		                <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width:560px;background:#ffffff;border-radius:18px;border:1px solid #e2e8f0;overflow:hidden;">
		                  <tr>
		                    <td style="padding:28px 28px 10px 28px;background:linear-gradient(135deg,#111827,#1f2937);">
		                      <div style="font-size:12px;letter-spacing:.12em;text-transform:uppercase;color:#cbd5e1;">Momentum Security</div>
		                      <h1 style="margin:12px 0 0 0;font-size:26px;line-height:1.2;color:#ffffff;">Password reset request</h1>
		                    </td>
		                  </tr>
		                  <tr>
		                    <td style="padding:24px 28px 0 28px;">
		                      <p style="margin:0 0 12px 0;font-size:15px;line-height:1.6;color:#334155;">
		                        We received a request to reset your password. Use the code below to continue:
		                      </p>
		                      <div style="margin:0 0 14px 0;padding:18px 14px;border:1px dashed #94a3b8;border-radius:14px;background:#f8fafc;text-align:center;">
		                        <span style="display:inline-block;font-size:34px;line-height:1;letter-spacing:0.35em;font-weight:700;color:#0f172a;">
		                          {code}
		                        </span>
		                      </div>
		                      <p style="margin:0;font-size:14px;line-height:1.6;color:#475569;">
		                        This code expires on <strong>{expiresAtText}</strong>.
		                      </p>
		                    </td>
		                  </tr>
		                  <tr>
		                    <td style="padding:18px 28px 26px 28px;">
		                      <div style="border-radius:12px;background:#fff7ed;border:1px solid #fdba74;padding:12px 14px;">
		                        <p style="margin:0;font-size:13px;line-height:1.6;color:#9a3412;">
		                          If you did not request this, ignore this email. Never share this code with anyone.
		                        </p>
		                      </div>
		                    </td>
		                  </tr>
		                </table>
		              </td>
		            </tr>
		          </table>
		        </body>
		        </html>
		        """;
	}

	public async Task<Result<string>> VerifyCodeAsync(string email, string code, CancellationToken ct)
	{
		if (string.IsNullOrWhiteSpace(email))
			return Errors.ParamNull(nameof(email));

		if (string.IsNullOrWhiteSpace(code))
			return Errors.ParamNull(nameof(code));

		var normalizedEmail = email.Trim().ToUpperInvariant();
		var normalizedCode = code.Trim();

		var challengeResult = await passwordResetStore.GetChallengeAsync(normalizedEmail, ct);
		if (challengeResult.IsFailure)
			return challengeResult.Error;

		var challenge = challengeResult.Value;
		if (challenge.ExpiresAtUtc <= DateTime.UtcNow)
			return Errors.IdentityError("Code expired.");
		
		var hashBytes = SHA256.HashData(Encoding.UTF8.GetBytes($"{normalizedCode}:{challenge.Salt}"));
		var incomingHash = Convert.ToBase64String(hashBytes);

		if (!string.Equals(challenge.CodeHash, incomingHash, StringComparison.Ordinal))
			return Errors.IdentityError("Invalid code.");

		var resetSessionToken = Guid.NewGuid().ToString("N");

		await passwordResetStore.SaveSessionTokenAsync(challenge.NormalizedEmail, resetSessionToken, ct);
		await passwordResetStore.DeleteChallenge(challenge.NormalizedEmail, ct);
		
		return resetSessionToken;
	}

	public async Task<Result> ResetPasswordAsync(string resetSessionToken, string newPassword, CancellationToken ct)
	{
		if (string.IsNullOrWhiteSpace(resetSessionToken))
			return Result.Failure(Errors.ParamNull(nameof(resetSessionToken)));

		if (string.IsNullOrWhiteSpace(newPassword))
			return Result.Failure(Errors.ParamNull(nameof(newPassword)));

		var sessionResult = await passwordResetStore.GetSessionTokenAsync(resetSessionToken, ct);
		if (sessionResult.IsFailure)
			return sessionResult.Error;

		var normalizedEmail = sessionResult.Value;
		var user = await userManager.Users.FirstOrDefaultAsync(x => x.NormalizedEmail == normalizedEmail, ct);
		if (user is null)
			return Errors.IdentityError("User not found.");

		var aspResetToken = await userManager.GeneratePasswordResetTokenAsync(user);
		var resetResult = await userManager.ResetPasswordAsync(user, aspResetToken, newPassword);
		if (!resetResult.Succeeded)
		{
			var message = resetResult.Errors.FirstOrDefault()?.Description ?? "Failed to reset password.";
			return Errors.IdentityError(message);
		}

		await passwordResetStore.DeleteSessionTokenAsync(resetSessionToken, ct);
		return Result.Success();
	}
}
