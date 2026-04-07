using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Momentum.Domain.Entities;
using Momentum.Infrastructure.Data.Identity;

namespace Momentum.Infrastructure.Data.Configurations;

public class AreaConfiguration : IEntityTypeConfiguration<Area>
{
  public void Configure(EntityTypeBuilder<Area> builder)
  {
    builder.HasKey(a => a.Id);

    builder.OwnsOne(a => a.Name, name =>
    {
      name.Property(v => v.Value)
        .HasColumnName("Name")
        .HasMaxLength(100)
        .IsRequired();
    });

    builder.HasMany(a => a.Projects)
      .WithOne()
      .HasForeignKey(p => p.AreaId)
      .IsRequired()
      .OnDelete(DeleteBehavior.Cascade);

    builder.HasOne<ApplicationUser>()
      .WithMany()
      .HasForeignKey(a => a.UserId)
      .IsRequired()
      .OnDelete(DeleteBehavior.Cascade);

    builder.HasIndex(a => a.UserId);
  }
}


