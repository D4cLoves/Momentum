using Momentum.Core.EndpointsSettings;

namespace Momentum.Core.Features.Lessons;

public class CreateEndpoint : IEndpoint
{
    public void MapEndpoint(IEndpointRouteBuilder app)
    {
        app.MapPost("/lessons", async (CreateHandler handler, CancellationToken cancellationToken) =>
        {
            await handler.Handle(cancellationToken);
            return Results.Accepted();
        })
        .WithName("CreateLesson");
    }
}

public sealed class CreateHandler
{
    private readonly ILogger<CreateHandler> _logger;

    public CreateHandler(ILogger<CreateHandler> logger)
    {
        _logger = logger;
    }

    public async Task Handle(CancellationToken cancellationToken)
    {
        _logger.LogInformation("Creating a new lesson");
        await Task.Delay(TimeSpan.FromSeconds(2), cancellationToken);
    }
}
