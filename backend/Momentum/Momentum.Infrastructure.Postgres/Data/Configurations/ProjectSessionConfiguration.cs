using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Momentum.Domain.Entities;

namespace Momentum.Infrastructure.Data.Configurations;

public class ProjectSessionConfiguration : IEntityTypeConfiguration<ProjectSession>
{
  public void Configure(EntityTypeBuilder<ProjectSession> builder)
  {
    builder.HasKey(s => s.Id);

    builder.Property(s => s.ProjectId)
      .IsRequired();

    builder.OwnsOne(s => s.Title, title =>
    {
      title.Property(v => v.Value)
        .HasColumnName("Title")
        .HasMaxLength(100)
        .IsRequired();
    });

    builder.OwnsOne(s => s.Goal, goal =>
    {
      goal.Property(v => v.Value)
        .HasColumnName("Goal")
        .HasMaxLength(100)
        .IsRequired();
    });

    builder.Property(s => s.StartedAt)
      .IsRequired();

    builder.Property(s => s.EndedAt);

    builder.Property(s => s.Duration)
      .IsRequired();

    builder.OwnsOne(s => s.Notes, notes =>
    {
      notes.Property(v => v.Value)
        .HasColumnName("Notes")
        .HasMaxLength(10000);
    });

    builder.HasMany(s => s.Tasks)
      .WithOne()
      .HasForeignKey(t => t.SessionId)
      .IsRequired()
      .OnDelete(DeleteBehavior.Cascade);

    builder.HasIndex(s => s.ProjectId);
  }
}


