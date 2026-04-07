using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Momentum.Domain.Entities;

namespace Momentum.Infrastructure.Data.Configurations;

public class SessionTaskConfiguration : IEntityTypeConfiguration<SessionTask>
{
  public void Configure(EntityTypeBuilder<SessionTask> builder)
  {
    builder.HasKey(t => t.Id);

    builder.Property(t => t.SessionId)
      .IsRequired();

    builder.OwnsOne(t => t.Description, description =>
    {
      description.Property(v => v.Value)
        .HasColumnName("Description")
        .HasMaxLength(100)
        .IsRequired();
    });

    builder.Property(t => t.IsCompleted)
      .IsRequired();

    builder.Property(t => t.CompletedAt);

    builder.HasIndex(t => t.SessionId);
  }
}


