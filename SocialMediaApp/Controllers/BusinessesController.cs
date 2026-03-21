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

        if (!ModelState.IsValid)
        {
            return View(model);
        }

        model.OwnerUserId = userId.Value;
        _db.Businesses.Add(model);
        _db.SaveChanges();

        return RedirectToAction("Index", "Dashboard");
    }
}

