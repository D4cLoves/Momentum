namespace Momentum.Core.Features.Areas.Create;

public sealed record CreateAreaRequest(string Name);
public sealed record AreaResponse(Guid Id, string Name, DateTime CreatedAt, int ProjectsCount);
