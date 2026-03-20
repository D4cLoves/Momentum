using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Momentum.Domain.Entities;
using Momentum.Infrastructure.Data.Identity;

namespace Momentum.Infrastructure.Data.Configurations;

public class ProjectConfiguration : IEntityTypeConfiguration<Project>
{
  public void Configure(EntityTypeBuilder<Project> builder)
  {
    builder.HasKey(p => p.Id);

    builder.Property(p => p.AreaId)
      .IsRequired();

    builder.Property(p => p.TargetHours)
      .IsRequired(false);

    builder.OwnsOne(p => p.Name, name =>
    {
      name.Property(v => v.Value)
        .HasColumnName("Name")
        .HasMaxLength(100)
        .IsRequired();
    });

    builder.OwnsOne(p => p.Goal, goal =>
    {
      goal.Property(v => v.Value)
        .HasColumnName("Goal")
        .HasMaxLength(100)
        .IsRequired();
    });

    builder.OwnsOne(p => p.PrimaryTask, task =>
    {
      task.Property(v => v.Value)
        .HasColumnName("PrimaryTask")
        .HasMaxLength(100)
        .IsRequired(false);
    });

    builder.OwnsOne(p => p.Notes, notes =>
    {
      notes.Property(v => v.Value)
        .HasColumnName("Notes")
        .HasMaxLength(10000);
    });

    builder.HasMany(p => p.Sessions)
      .WithOne()
      .HasForeignKey(s => s.ProjectId)
      .IsRequired()
      .OnDelete(DeleteBehavior.Cascade);

    builder.HasOne<Area>()
      .WithMany(a => a.Projects)
      .HasForeignKey(p => p.AreaId)
      .IsRequired()
      .OnDelete(DeleteBehavior.Cascade);

    builder.HasOne<ApplicationUser>()
      .WithMany()
      .HasForeignKey(p => p.UserId)
      .IsRequired()
      .OnDelete(DeleteBehavior.Cascade);

    builder.HasIndex(p => p.UserId);
    builder.HasIndex(p => p.AreaId);
  }
}


