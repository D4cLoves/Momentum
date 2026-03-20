using Microsoft.Extensions.DependencyInjection;
using Momentum.Application.Features.Areas.Create;
using Momentum.Application.Features.Areas.Delete;
using Momentum.Application.Features.Areas.UpdateName;
using Momentum.Application.Features.Projects.Create;
using Momentum.Application.Features.Projects.Delete;
using Momentum.Application.Features.Projects.GetAll;
using Momentum.Application.Features.Projects.GetById;
using Momentum.Application.Features.Projects.Update;
using Momentum.Application.Features.Sessions.Delete;
using Momentum.Application.Features.Sessions.End;
using Momentum.Application.Features.Sessions.GetAll;
using Momentum.Application.Features.Sessions.GetById;
using Momentum.Application.Features.Sessions.Start;
using Momentum.Application.Features.Users.Login;
using Momentum.Application.Features.Users.Refresh;
using Momentum.Application.Features.Users.Register;

namespace Momentum.Application.DependencyInjection;

public static class ApplicationHandlers
{
	public static IServiceCollection AddApplicationHandlers(this IServiceCollection services)
	{
		// area
		services.AddScoped<CreateAreaHandler>();
		services.AddScoped<DeleteAreaHandler>();
		services.AddScoped<UpdateAreaNameHandler>();
	
		// project
		services.AddScoped<CreateProjectHandler>();
		services.AddScoped<DeleteProjectHandler>();
		services.AddScoped<GetProjectByIdHandler>();
		services.AddScoped<GetProjectsHandler>();
		services.AddScoped<UpdateProjectHandler>();
	
		// session
		services.AddScoped<StartSessionHandler>();
		services.AddScoped<EndSessionHandler>();
		services.AddScoped<DeleteSessionHandler>();
		services.AddScoped<GetSessionsHandler>();
		services.AddScoped<GetSessionByIdHandler>();
	
		// auth
		services.AddScoped<LoginUserHandler>();
		services.AddScoped<RefreshTokensHandler>();
		services.AddScoped<RegisterUserHandler>();

		return services;
	}
}