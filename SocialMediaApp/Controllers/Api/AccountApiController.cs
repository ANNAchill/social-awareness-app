using System.Security.Cryptography;
using System.Text;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SocialMediaApp.Data;
using SocialMediaApp.Models;

namespace SocialMediaApp.Controllers.Api;

[ApiController]
[Route("api/[controller]")]
public class AccountApiController : ControllerBase
{
    private readonly SocialDbContext _db;
    private readonly IConfiguration _configuration;

    public AccountApiController(SocialDbContext db, IConfiguration configuration)
    {
        _db = db;
        _configuration = configuration;
    }

    [HttpPost("login")]
    public IActionResult Login([FromBody] LoginRequest req)
    {
        if (string.IsNullOrWhiteSpace(req?.Email) || string.IsNullOrWhiteSpace(req.Password))
            return BadRequest(new { error = "Email and password required." });

        var hash = HashPassword(req.Password);
        var user = _db.Users
            .Include(u => u.UserRoles)
            .ThenInclude(ur => ur.Role)
            .FirstOrDefault(u => u.Email == req.Email.Trim() && u.PasswordHash == hash);
        if (user is null)
            return Unauthorized(new { error = "Invalid email or password." });

        HttpContext.Session.SetInt32("UserId", user.Id);
        var roles = user.UserRoles.Select(ur => ur.Role.Name).ToList();
        return Ok(new UserDto(user.Id, user.FullName, user.Email, roles));
    }

    [HttpPost("register")]
    public IActionResult Register([FromBody] RegisterRequest req)
    {
        if (string.IsNullOrWhiteSpace(req?.FullName) || string.IsNullOrWhiteSpace(req.Email) || string.IsNullOrWhiteSpace(req.Password))
            return BadRequest(new { error = "All fields are required." });

        if (_db.Users.Any(u => u.Email == req.Email.Trim()))
            return BadRequest(new { error = "An account with this email already exists." });

        var memberRole = _db.Roles.FirstOrDefault(r => r.Name == RoleSeeder.RoleMember);
        if (memberRole is null) return StatusCode(500, new { error = "Member role not found. Please restart the app." });

        var user = new User
        {
            FullName = req.FullName.Trim(),
            Email = req.Email.Trim(),
            PasswordHash = HashPassword(req.Password)
        };
        _db.Users.Add(user);
        _db.SaveChanges();

        _db.UserRoles.Add(new UserRole { UserId = user.Id, RoleId = memberRole.Id });
        _db.SaveChanges();

        HttpContext.Session.SetInt32("UserId", user.Id);
        return Ok(new UserDto(user.Id, user.FullName, user.Email, new[] { RoleSeeder.RoleMember }));
    }

    [HttpPost("logout")]
    public IActionResult Logout()
    {
        HttpContext.Session.Clear();
        return Ok();
    }

    [HttpGet("me")]
    public IActionResult Me()
    {
        var userId = HttpContext.Session.GetInt32("UserId");
        if (userId is null) return Ok((object?)null);

        var user = _db.Users
            .Include(u => u.UserRoles)
            .ThenInclude(ur => ur.Role)
            .FirstOrDefault(u => u.Id == userId.Value);
        if (user is null) return Ok((object?)null);

        var roles = user.UserRoles.Select(ur => ur.Role.Name).ToArray();
        return Ok(new UserDto(user.Id, user.FullName, user.Email, roles));
    }

    [HttpPost("register-admin")]
    public IActionResult RegisterAdmin([FromBody] RegisterAdminRequest req)
    {
        if (string.IsNullOrWhiteSpace(req?.FullName) || string.IsNullOrWhiteSpace(req.Email) || string.IsNullOrWhiteSpace(req.Password))
            return BadRequest(new { error = "All fields are required." });

        var key = _configuration["AdminRegistrationKey"];
        if (string.IsNullOrEmpty(key) || req.AdminKey != key)
            return BadRequest(new { error = "Invalid or missing admin registration key." });

        if (_db.Users.Any(u => u.Email == req.Email.Trim()))
            return BadRequest(new { error = "An account with this email already exists." });

        var adminRole = _db.Roles.FirstOrDefault(r => r.Name == RoleSeeder.RoleAdmin);
        if (adminRole is null) return StatusCode(500, new { error = "Admin role not found." });

        var user = new User
        {
            FullName = req.FullName.Trim(),
            Email = req.Email.Trim(),
            PasswordHash = HashPassword(req.Password)
        };
        _db.Users.Add(user);
        _db.SaveChanges();

        _db.UserRoles.Add(new UserRole { UserId = user.Id, RoleId = adminRole.Id });
        _db.SaveChanges();

        HttpContext.Session.SetInt32("UserId", user.Id);
        return Ok(new UserDto(user.Id, user.FullName, user.Email, new[] { RoleSeeder.RoleAdmin }));
    }

    private static string HashPassword(string password)
    {
        using var sha = SHA256.Create();
        var bytes = sha.ComputeHash(Encoding.UTF8.GetBytes(password));
        return Convert.ToHexString(bytes);
    }
}

public record LoginRequest(string Email, string Password);
public record RegisterRequest(string FullName, string Email, string Password);
public record RegisterAdminRequest(string AdminKey, string FullName, string Email, string Password);
public record UserDto(int Id, string FullName, string Email, IReadOnlyList<string> Roles);
