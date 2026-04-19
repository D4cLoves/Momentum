using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Momentum.Domain.Entities;

namespace Momentum.Infrastructure.Data.Configurations;

public sealed class UserStreakConfiguration : IEntityTypeConfiguration<UserStreak>
{
	public void Configure(EntityTypeBuilder<UserStreak> builder)
	{
		builder.HasKey(x => x.Id);

		builder.Property(x => x.UserId)
			.HasMaxLength(450)
			.IsRequired();

		builder.Property(x => x.TimeZoneId)
			.HasMaxLength(100)
			.IsRequired();

		builder.Property(x => x.CurrentStreak)
			.IsRequired();

		builder.Property(x => x.BestStreak)
			.IsRequired();

		builder.Property(x => x.LastActivityLocalDate);

		builder.Property(x => x.LastCountedAtUtc);

		builder.HasIndex(x => x.UserId)
			.IsUnique();
	}
}