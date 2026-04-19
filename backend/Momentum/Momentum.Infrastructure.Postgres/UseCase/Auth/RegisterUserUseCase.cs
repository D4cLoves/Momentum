using Microsoft.AspNetCore.Identity;
using Momentum.Application.Features.Users.Abstractions;
using Momentum.Application.Features.Users.Common;
using Momentum.Application.Features.Users.Register;
using Momentum.SharedKernel;
using Momentum.Infrastructure.Data.Identity;

namespace Momentum.Infrastructure.Postgres.Services;

public sealed class RegisterUserUseCase(UserManager<ApplicationUser> userManager) : IRegisterUserUseCase
{
    public async Task<Result> Handle(RegisterUserRequest request, CancellationToken ct = default)
    {
        if (string.IsNullOrWhiteSpace(request.Name))
            return Errors.ParamNull(nameof(request.Name));
        if (string.IsNullOrWhiteSpace(request.Email))
            return Errors.ParamNull(nameof(request.Email));
        if (string.IsNullOrWhiteSpace(request.Password))
            return Errors.ParamNull(nameof(request.Password));

        var user = new ApplicationUser { UserName = request.Name, Email = request.Email };
        if (await userManager.FindByEmailAsync(request.Email) != null)
            return UserErrors.EmailAlreadyExists;

        var identityResult = await userManager.CreateAsync(user, request.Password);
        if (!identityResult.Succeeded)
            return Errors.IdentityError(identityResult.Errors.First().Description);

        var roleResult = await userManager.AddToRoleAsync(user, RoleNames.User);
        if (!roleResult.Succeeded)
        {
            await userManager.DeleteAsync(user);
            return Errors.IdentityError(roleResult.Errors.First().Description);
        }

        return Result.Success();
    }
}


