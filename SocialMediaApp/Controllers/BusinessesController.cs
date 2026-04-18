using Microsoft.AspNetCore.Mvc;
using SocialMediaApp.Data;
using SocialMediaApp.Models;

namespace SocialMediaApp.Controllers;

public class BusinessesController : Controller
{
    private readonly SocialDbContext _db;

    public BusinessesController(SocialDbContext db)
    {
        _db = db;
    }

    public IActionResult Index()
    {
        var businesses = _db.Businesses.ToList();
        return View(businesses);
    }

    public IActionResult Create()
    {
        if (HttpContext.Session.GetInt32("UserId") is null)
        {
            return RedirectToAction("Login", "Account", new { returnUrl = Url.Action("Create", "Businesses") });
        }

        return View();
    }

    [HttpPost]
public IActionResult Create(Business model)
{
    var userId = HttpContext.Session.GetInt32("UserId");
    if (userId is null)
    {
        return RedirectToAction("Login", "Account", new { returnUrl = Url.Action("Create", "Businesses") });
    }

    if (model is null)
    {
        return View(new Business());
    }

    if (string.IsNullOrWhiteSpace(model.Name))
    {
        ModelState.AddModelError(nameof(Business.Name), "Business name is required.");
    }

    model.Name = model.Name?.Trim() ?? string.Empty;
    model.Industry = model.Industry?.Trim() ?? string.Empty;
    model.Website = string.IsNullOrWhiteSpace(model.Website) ? null : model.Website.Trim();
    model.City = string.IsNullOrWhiteSpace(model.City) ? null : model.City.Trim();
    model.OwnerId = userId.Value;
    model.OwnerUserId = userId.Value;

    ModelState.Remove(nameof(Business.Owner));

    if (!ModelState.IsValid)
    {
        return View(model);
    }

    _db.Businesses.Add(model);
    _db.SaveChanges();

    return RedirectToAction("Index", "Dashboard");
}
}
