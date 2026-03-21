using Microsoft.AspNetCore.Mvc;
using SocialMediaApp.Models;

namespace SocialMediaApp.Controllers;

public class FeedController : Controller
{
    // In-memory demo storage for posts. In a real app you would use a database.
    private static readonly List<Post> _posts = new();

    public IActionResult Index()
    {
        if (!_posts.Any())
        {
            _posts.AddRange([
                new Post
                {
                    Id = 1,
                    AuthorName = "Alice",
                    Content = "Excited to try out this new ASP.NET Core social media app!",
                    CreatedAt = DateTime.UtcNow.AddMinutes(-20),
                    Likes = 3
                },
                new Post
                {
                    Id = 2,
                    AuthorName = "Bob",
                    Content = "Hello from the in-memory feed. Replace me with data from EF Core when you're ready.",
                    CreatedAt = DateTime.UtcNow.AddMinutes(-5),
                    Likes = 1
                }
            ]);
        }

        var ordered = _posts
            .OrderByDescending(p => p.CreatedAt)
            .ToList();

        return View(ordered);
    }

    [HttpPost]
    public IActionResult Create(string authorName, string content)
    {
        if (string.IsNullOrWhiteSpace(content))
        {
            return RedirectToAction(nameof(Index));
        }

        var post = new Post
        {
            Id = _posts.Count == 0 ? 1 : _posts.Max(p => p.Id) + 1,
            AuthorName = string.IsNullOrWhiteSpace(authorName) ? "Anonymous" : authorName.Trim(),
            Content = content.Trim(),
            CreatedAt = DateTime.UtcNow
        };

        _posts.Add(post);
        return RedirectToAction(nameof(Index));
    }

    [HttpPost]
    public IActionResult Like(int id)
    {
        var post = _posts.FirstOrDefault(p => p.Id == id);
        if (post is not null)
        {
            post.Likes++;
        }

        return RedirectToAction(nameof(Index));
    }
}

