using Microsoft.AspNetCore.Mvc;
using SocialMediaApp.Data;
using SocialMediaApp.Models;

namespace SocialMediaApp.Controllers;

public class CampaignsController : Controller
{
    private readonly SocialDbContext _db;

    public CampaignsController(SocialDbContext db)
    {
        _db = db;
    }

    public IActionResult Index()
    {
        var campaigns = _db.Campaigns.ToList();
        return View(campaigns);
    }

    public IActionResult Create()
    {
        if (HttpContext.Session.GetInt32("UserId") is null)
        {
            return RedirectToAction("Login", "Account", new { returnUrl = Url.Action("Create", "Campaigns") });
        }

        return View();
    }

[HttpPost]
public IActionResult Create(Campaign model)
{
    var userId = HttpContext.Session.GetInt32("UserId");
    if (userId is null)
    {
        return RedirectToAction("Login", "Account", new { returnUrl = Url.Action("Create", "Campaigns") });
    }

    if (string.IsNullOrWhiteSpace(model?.Title))
    {
        ModelState.AddModelError(nameof(Campaign.Title), "Campaign title is required.");
    }

    if (model is null)
    {
        return View(new Campaign());
    }

    model.OwnerId = userId.Value;
    model.OwnerUserId = userId.Value;
    model.Status = "Pending";
    model.Title = model.Title?.Trim() ?? "";
    model.Description = model.Description?.Trim() ?? "";
    model.ImpactGoal = model.ImpactGoal?.Trim() ?? "";

    ModelState.Remove(nameof(Campaign.Owner));
    ModelState.Remove(nameof(Campaign.Images));

    if (!ModelState.IsValid)
    {
        return View(model);
    }

    _db.Campaigns.Add(model);
    _db.SaveChanges();

    return RedirectToAction("Index", "Dashboard");
}
}
