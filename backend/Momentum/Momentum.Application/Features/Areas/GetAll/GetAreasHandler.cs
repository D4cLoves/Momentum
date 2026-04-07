using Momentum.Application.Features.Areas.Common;
using Momentum.Application.Abstractions.Persistence;
using Momentum.Domain.Interfaces;
using Momentum.SharedKernel;
using Momentum.Domain.Entities;

namespace Momentum.Application.Features.Areas.GetAll;

public sealed class GetAreasHandler
{
    private readonly IAreaRepository _areaRepository;

    public GetAreasHandler(IAreaRepository areaRepository)
    {
        ArgumentNullException.ThrowIfNull(areaRepository);
        _areaRepository = areaRepository;
    }

    public async Task<Result<List<AreaResponse>>> Handle(string userId)
    {
        ArgumentException.ThrowIfNullOrWhiteSpace(userId);

        List<Area> areas = await _areaRepository.GetByUserIdAsync(userId);
        List<AreaResponse> response = areas
            .Select(a => a.ToResponse())
            .ToList();

        return response;
    }
}

