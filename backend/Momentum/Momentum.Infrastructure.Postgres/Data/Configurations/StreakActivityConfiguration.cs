using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Momentum.Domain.Entities;

namespace Momentum.Infrastructure.Data.Configurations;

public sealed class StreakActivityConfiguration : IEntityTypeConfiguration<StreakActivity>
{
	public void Configure(EntityTypeBuilder<StreakActivity> builder)
	{
		builder.HasKey(x => x.Id);

		builder.Property(x => x.UserId)
			.HasMaxLength(450)
			.IsRequired();

		builder.Property(x => x.ActivityDateLocal)
			.IsRequired();

		builder.Property(x => x.TimeZoneId)
			.HasMaxLength(100)
			.IsRequired();

		builder.Property(x => x.OccurredAtUtc)
			.IsRequired();

		builder.Property(x => x.SourceType)
			.HasMaxLength(100)
			.IsRequired();

		builder.Property(x => x.SourceEventId)
			.IsRequired();

		builder.HasIndex(x => new { x.UserId, x.ActivityDateLocal })
			.IsUnique();

		builder.HasIndex(x => new { x.UserId, x.SourceType, x.SourceEventId })
			.IsUnique();
	}
}
