using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SocialMediaApp.Data;
using SocialMediaApp.Models;

namespace SocialMediaApp.Controllers.Api;

[ApiController]
[Route("api/[controller]")]
public class CampaignsApiController : ControllerBase
{
    private readonly SocialDbContext _db;

    public CampaignsApiController(SocialDbContext db) => _db = db;

    [HttpGet]
    public async Task<IActionResult> GetAll(CancellationToken ct)
    {
        var list = await _db.Campaigns
            .OrderByDescending(c => c.Id)
            .Select(c => new CampaignDto(
                c.Id,
                c.Title,
                c.Description ?? "",
                c.ImpactGoal ?? "",
                c.Status ?? "Pending",
                c.Images.OrderBy(i => i.SortOrder).ThenBy(i => i.Id).Select(i => i.FilePath).ToList()
            ))
            .ToListAsync(ct);
        return Ok(list);
    }

    [HttpPost]
    [RequestSizeLimit(25_000_000)]
    public async Task<IActionResult> Create(CancellationToken ct)
    {
        var userId = HttpContext.Session.GetInt32("UserId");
        if (userId is null) return Unauthorized(new { error = "Please log in." });

        if (!Request.HasFormContentType)
            return BadRequest(new { error = "Expected multipart form data." });

        var form = await Request.ReadFormAsync(ct);
        var title = form["title"].ToString();
        var description = form["description"].ToString();
        var impactGoal = form["impactGoal"].ToString();

        if (string.IsNullOrWhiteSpace(title))
            return BadRequest(new { error = "Title is required." });

        var campaign = new Campaign
        {
            Title = title.Trim(),
            Description = description?.Trim() ?? "",
            ImpactGoal = impactGoal?.Trim() ?? "",
            Status = "Pending",
            OwnerId = userId.Value,
            OwnerUserId = userId.Value
        };
        _db.Campaigns.Add(campaign);
        await _db.SaveChangesAsync(ct);

        var createdImages = new List<string>();
        var files = form.Files;
        if (files is not null && files.Count > 0)
        {
            var webRoot = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot");
            var uploadDir = Path.Combine(webRoot, "uploads", "campaigns", campaign.Id.ToString());
            Directory.CreateDirectory(uploadDir);

            for (var idx = 0; idx < files.Count; idx++)
            {
                var file = files[idx];
                if (file is null || file.Length == 0) continue;
                if (!file.ContentType.StartsWith("image/", StringComparison.OrdinalIgnoreCase))
                    continue;

                var safeExt = Path.GetExtension(file.FileName);
                if (string.IsNullOrWhiteSpace(safeExt)) safeExt = ".jpg";

                var fileName = $"{Guid.NewGuid():N}{safeExt}";
                var absPath = Path.Combine(uploadDir, fileName);
                await using (var stream = System.IO.File.Create(absPath))
                {
                    await file.CopyToAsync(stream, ct);
                }

                var relPath = $"/uploads/campaigns/{campaign.Id}/{fileName}";
                _db.CampaignImages.Add(new CampaignImage
                {
                    CampaignId = campaign.Id,
                    FilePath = relPath,
                    SortOrder = idx
                });
                createdImages.Add(relPath);
            }

            await _db.SaveChangesAsync(ct);

            // Optional: set cover image to first uploaded
            if (createdImages.Count > 0 && string.IsNullOrWhiteSpace(campaign.CoverImagePath))
            {
                campaign.CoverImagePath = createdImages[0];
                await _db.SaveChangesAsync(ct);
            }
        }

        return Ok(new CampaignDto(campaign.Id, campaign.Title, campaign.Description, campaign.ImpactGoal, campaign.Status, createdImages));
    }
}

public record CampaignDto(int Id, string Title, string Description, string ImpactGoal, string Status, IReadOnlyList<string> Images);
