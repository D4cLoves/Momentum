using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Momentum.Domain.Entities;

namespace Momentum.Infrastructure.Data.Configurations;

public class RefreshTokenConfiguration : IEntityTypeConfiguration<RefreshToken>
{
	public void Configure(EntityTypeBuilder<RefreshToken> builder)
	{
		builder.HasKey(t => t.Id);

		builder.Property(t => t.UserId)
			.IsRequired();

		builder.Property(t => t.TokenHash)
			.IsRequired();

		builder.Property(t => t.CreatedAtUtc)
			.IsRequired();

		builder.Property(t => t.ExpiresAtUtc)
			.IsRequired();

		builder.HasIndex(t => t.TokenHash)
			.IsUnique();

		builder.HasIndex(t => t.UserId);
	}
}


