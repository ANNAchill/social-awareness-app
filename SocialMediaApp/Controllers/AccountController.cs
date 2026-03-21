using System.Security.Cryptography;
using System.Text;
using Microsoft.AspNetCore.Mvc;
using SocialMediaApp.Data;
using SocialMediaApp.Models;

namespace SocialMediaApp.Controllers;

public class AccountController : Controller
{
    private readonly SocialDbContext _db;

    public AccountController(SocialDbContext db)
    {
        _db = db;
    }

    public IActionResult Login(string? returnUrl = null)
    {
        ViewData["ReturnUrl"] = returnUrl;
        return View();
    }

    [HttpPost]
    public IActionResult Login(string email, string password, string? returnUrl = null)
    {
        var hash = HashPassword(password);
        var user = _db.Users.FirstOrDefault(u => u.Email == email && u.PasswordHash == hash);
        if (user is null)
        {
            ViewData["Error"] = "Invalid email or password.";
            ViewData["ReturnUrl"] = returnUrl;
            return View();
        }

        HttpContext.Session.SetInt32("UserId", user.Id);
        return RedirectToLocal(returnUrl, "Dashboard", "Index");
    }

    public IActionResult Register()
    {
        return View();
    }

    [HttpPost]
    public IActionResult Register(string fullName, string email, string password)
    {
        if (string.IsNullOrWhiteSpace(fullName) || string.IsNullOrWhiteSpace(email) || string.IsNullOrWhiteSpace(password))
        {
            ViewData["Error"] = "All fields are required.";
            return View();
        }

        if (_db.Users.Any(u => u.Email == email))
        {
            ViewData["Error"] = "An account with this email already exists.";
            return View();
        }

        var user = new User
        {
            FullName = fullName.Trim(),
            Email = email.Trim(),
            PasswordHash = HashPassword(password)
        };

        _db.Users.Add(user);
        _db.SaveChanges();

        HttpContext.Session.SetInt32("UserId", user.Id);
        return RedirectToAction("Index", "Dashboard");
    }

    public IActionResult Logout()
    {
        HttpContext.Session.Clear();
        return RedirectToAction("Index", "Home");
    }

    private static string HashPassword(string password)
    {
        using var sha = SHA256.Create();
        var bytes = sha.ComputeHash(Encoding.UTF8.GetBytes(password));
        return Convert.ToHexString(bytes);
    }

    private IActionResult RedirectToLocal(string? returnUrl, string defaultController, string defaultAction)
    {
        if (!string.IsNullOrWhiteSpace(returnUrl) && Url.IsLocalUrl(returnUrl))
        {
            return Redirect(returnUrl);
        }

        return RedirectToAction(defaultAction, defaultController);
    }
}

