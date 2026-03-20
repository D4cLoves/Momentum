using Momentum.Domain.Entities;

namespace Momentum.Application.Features.Areas.Common;

public static class AreaMappings
{
    public static AreaResponse ToResponse(this Area area)
    {
        ArgumentNullException.ThrowIfNull(area);
        return new AreaResponse(area.Id, area.Name.Value, area.CreatedAt, area.Projects.Count);
    }
}


