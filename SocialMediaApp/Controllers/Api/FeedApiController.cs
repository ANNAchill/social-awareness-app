using Microsoft.AspNetCore.Mvc;
using SocialMediaApp.Models;

namespace SocialMediaApp.Controllers.Api;

[ApiController]
[Route("api/[controller]")]
public class FeedApiController : ControllerBase
{
    private static readonly List<Post> _posts = new();
    private static int _nextId = 1;
    private static readonly object _lock = new();

    [HttpGet]
    public IActionResult GetAll()
    {
        lock (_lock)
        {
            if (_posts.Count == 0)
            {
                _posts.AddRange([
                    new Post { Id = _nextId++, AuthorName = "Alice", Content = "Excited to try out this new ASP.NET Core social media app!", CreatedAt = DateTime.UtcNow.AddMinutes(-20), Likes = 3 },
                    new Post { Id = _nextId++, AuthorName = "Bob", Content = "Hello from the community feed. Share your ideas here!", CreatedAt = DateTime.UtcNow.AddMinutes(-5), Likes = 1 }
                ]);
            }
            var ordered = _posts.OrderByDescending(p => p.CreatedAt).Select(p => new PostDto(p.Id, p.AuthorName, p.Content, p.CreatedAt, p.Likes)).ToList();
            return Ok(ordered);
        }
    }

    [HttpPost]
    public IActionResult Create([FromBody] CreatePostRequest req)
    {
        if (string.IsNullOrWhiteSpace(req?.Content))
            return BadRequest(new { error = "Content is required." });

        lock (_lock)
        {
            var post = new Post
            {
                Id = _nextId++,
                AuthorName = string.IsNullOrWhiteSpace(req.AuthorName) ? "Anonymous" : req.AuthorName.Trim(),
                Content = req.Content.Trim(),
                CreatedAt = DateTime.UtcNow,
                Likes = 0
            };
            _posts.Add(post);
            return Ok(new PostDto(post.Id, post.AuthorName, post.Content, post.CreatedAt, post.Likes));
        }
    }

    [HttpPost("{id:int}/like")]
    public IActionResult Like(int id)
    {
        lock (_lock)
        {
            var post = _posts.FirstOrDefault(p => p.Id == id);
            if (post is null) return NotFound();
            post.Likes++;
            return Ok(new PostDto(post.Id, post.AuthorName, post.Content, post.CreatedAt, post.Likes));
        }
    }
}

public record PostDto(int Id, string AuthorName, string Content, DateTime CreatedAt, int Likes);
public record CreatePostRequest(string? AuthorName, string Content);
