using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SocialMediaApp.Data;

namespace SocialMediaApp.Controllers.Api;

[ApiController]
[Route("api/[controller]")]
public class DashboardApiController : ControllerBase
{
    private readonly SocialDbContext _db;

    public DashboardApiController(SocialDbContext db) => _db = db;

    [HttpGet]
    public async Task<IActionResult> Get(CancellationToken ct)
    {
        var userId = HttpContext.Session.GetInt32("UserId");
        if (userId is null) return Unauthorized(new { error = "Please log in." });

        var user = await _db.Users
            .Include(u => u.Campaigns)
            .FirstOrDefaultAsync(u => u.Id == userId.Value, ct);
        if (user is null) return Unauthorized();

        var myBusinesses = await _db.Businesses
            .Where(b => b.OwnerUserId == user.Id)
            .Select(b => new { b.Id, b.Name, b.Industry, b.Website, b.City })
            .ToListAsync(ct);

        return Ok(new
        {
            user = new { user.Id, user.FullName, user.Email },
            myCampaigns = user.Campaigns.Select(c => new { c.Id, c.Title, c.Description, c.ImpactGoal, c.Status }).ToList(),
            myBusinesses
        });
    }
}
