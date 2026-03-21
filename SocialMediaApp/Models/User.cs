namespace SocialMediaApp.Models;

public class User
{
    public int Id { get; set; }

    public string FullName { get; set; } = string.Empty;

    public string Email { get; set; } = string.Empty;

    // Store a hash in a real app; for now this is just a placeholder.
    public string PasswordHash { get; set; } = string.Empty;

    public ICollection<UserRole> UserRoles { get; set; } = [];

    public ICollection<Campaign> Campaigns { get; set; } = [];

    public ICollection<UserActivity> Activities { get; set; } = [];
}

