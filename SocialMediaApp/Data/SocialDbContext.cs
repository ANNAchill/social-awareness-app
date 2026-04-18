using Microsoft.EntityFrameworkCore;
using SocialMediaApp.Models;

namespace SocialMediaApp.Data;

public class SocialDbContext : DbContext
{
    public SocialDbContext(DbContextOptions<SocialDbContext> options) : base(options)
    {
    }

    public DbSet<User> Users => Set<User>();
    public DbSet<Role> Roles => Set<Role>();
    public DbSet<UserRole> UserRoles => Set<UserRole>();
    public DbSet<Campaign> Campaigns => Set<Campaign>();
    public DbSet<CampaignImage> CampaignImages => Set<CampaignImage>();
    public DbSet<Business> Businesses => Set<Business>();
    public DbSet<UserActivity> UserActivities => Set<UserActivity>();
    public DbSet<AdminDemotionRequest> AdminDemotionRequests => Set<AdminDemotionRequest>();
    public DbSet<AdminDemotionApproval> AdminDemotionApprovals => Set<AdminDemotionApproval>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        modelBuilder.Entity<UserRole>()
            .HasKey(ur => new { ur.UserId, ur.RoleId });

        modelBuilder.Entity<UserRole>()
            .HasOne(ur => ur.User)
            .WithMany(u => u.UserRoles)
            .HasForeignKey(ur => ur.UserId);

        modelBuilder.Entity<UserRole>()
            .HasOne(ur => ur.Role)
            .WithMany(r => r.UserRoles)
            .HasForeignKey(ur => ur.RoleId);

        modelBuilder.Entity<Campaign>()
            .HasOne(c => c.Owner)
            .WithMany(u => u.Campaigns)
            .HasForeignKey(c => c.OwnerId)
            .OnDelete(DeleteBehavior.Cascade);

        modelBuilder.Entity<Business>()
            .HasOne(b => b.Owner)
            .WithMany(u => u.Businesses)
            .HasForeignKey(b => b.OwnerId)
            .OnDelete(DeleteBehavior.Cascade);

        modelBuilder.Entity<CampaignImage>()
            .HasOne(ci => ci.Campaign)
            .WithMany(c => c.Images)
            .HasForeignKey(ci => ci.CampaignId)
            .OnDelete(DeleteBehavior.Cascade);
    }
}
