namespace SocialMediaApp.Models;

public class Post
{
    public int Id { get; set; }

    public string AuthorName { get; set; } = string.Empty;

    public string Content { get; set; } = string.Empty;

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    public int Likes { get; set; }
}

