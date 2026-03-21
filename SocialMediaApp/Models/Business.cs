namespace SocialMediaApp.Models;

public class Business
{
    public int Id { get; set; }

    public string Name { get; set; } = string.Empty;

    public string Industry { get; set; } = string.Empty;

    public string? Website { get; set; }

    public string? City { get; set; }

    public int OwnerUserId { get; set; }
    public User Owner { get; set; } = null!;
}

