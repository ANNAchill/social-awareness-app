using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SocialMediaApp.Data;
using SocialMediaApp.Models;

namespace SocialMediaApp.Controllers.Api;

[ApiController]
[Route("api/[controller]")]
public class BusinessesApiController : ControllerBase
{
    private readonly SocialDbContext _db;

    public BusinessesApiController(SocialDbContext db) => _db = db;

    [HttpGet]
    public async Task<IActionResult> GetAll(CancellationToken ct)
    {
        var list = await _db.Businesses
            .OrderByDescending(b => b.Id)
            .Select(b => new BusinessDto(
                b.Id,
                b.Name,
                b.Industry,
                b.Website,
                b.City,
                b.OwnerId != 0 ? b.OwnerId : b.OwnerUserId))
            .ToListAsync(ct);
        return Ok(list);
    }

    [HttpPost]
    public async Task<IActionResult> Create([FromBody] CreateBusinessRequest req, CancellationToken ct)
    {
        var userId = HttpContext.Session.GetInt32("UserId");
        if (userId is null) return Unauthorized(new { error = "Please log in." });

        if (string.IsNullOrWhiteSpace(req?.Name))
            return BadRequest(new { error = "Business name is required." });

        var business = new Business
        {
            Name = req.Name.Trim(),
            Industry = req.Industry?.Trim() ?? string.Empty,
            Website = string.IsNullOrWhiteSpace(req.Website) ? null : req.Website.Trim(),
            City = string.IsNullOrWhiteSpace(req.City) ? null : req.City.Trim(),
            OwnerId = userId.Value,
            OwnerUserId = userId.Value
        };
        _db.Businesses.Add(business);
        await _db.SaveChangesAsync(ct);

        return Ok(new BusinessDto(business.Id, business.Name, business.Industry, business.Website, business.City, business.OwnerId));
    }
}

public record BusinessDto(int Id, string Name, string Industry, string? Website, string? City, int OwnerUserId);
public record CreateBusinessRequest(string Name, string? Industry, string? Website, string? City);
