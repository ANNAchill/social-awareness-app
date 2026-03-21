using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SocialMediaApp.Data;

namespace SocialMediaApp.Controllers;

public class DashboardController : Controller
{
    private readonly SocialDbContext _db;

    public DashboardController(SocialDbContext db)
    {
        _db = db;
    }

    public IActionResult Index()
    {
        var userId = HttpContext.Session.GetInt32("UserId");
        if (userId is null)
        {
            return RedirectToAction("Login", "Account", new { returnUrl = Url.Action("Index", "Dashboard") });
        }

        var user = _db.Users
            .Include(u => u.Campaigns)
            .FirstOrDefault(u => u.Id == userId.Value);

        if (user is null)
        {
            HttpContext.Session.Clear();
            return RedirectToAction("Login", "Account");
        }

        var myBusinesses = _db.Businesses
            .Where(b => b.OwnerUserId == user.Id)
            .ToList();

        var vm = new DashboardViewModel
        {
            User = user,
            MyCampaigns = user.Campaigns.ToList(),
            MyBusinesses = myBusinesses
        };

        return View(vm);
    }
}

public class DashboardViewModel
{
    public Models.User User { get; set; } = null!;
    public List<Models.Campaign> MyCampaigns { get; set; } = [];
    public List<Models.Business> MyBusinesses { get; set; } = [];
}

