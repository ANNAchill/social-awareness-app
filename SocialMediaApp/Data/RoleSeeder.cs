using Microsoft.EntityFrameworkCore;
using SocialMediaApp.Models;

namespace SocialMediaApp.Data;

public static class RoleSeeder
{
    public const string RoleAdmin = "Admin";
    public const string RoleMember = "Member";

    public static async Task SeedRolesAsync(SocialDbContext db, CancellationToken ct = default)
    {
        if (await db.Roles.AnyAsync(ct)) return;

        db.Roles.AddRange(
            new Role { Name = RoleMember },
            new Role { Name = RoleAdmin }
        );
        await db.SaveChangesAsync(ct);
    }
}
