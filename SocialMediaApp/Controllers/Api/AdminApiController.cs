using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SocialMediaApp.Data;
using SocialMediaApp.Models;

namespace SocialMediaApp.Controllers.Api;

[ApiController]
[Route("api/[controller]")]
public class AdminApiController : ControllerBase
{
    private readonly SocialDbContext _db;

    public AdminApiController(SocialDbContext db) => _db = db;

    private int? UserId => HttpContext.Session.GetInt32("UserId");

    private async Task<bool> IsAdminAsync(CancellationToken ct)
    {
        if (UserId is null) return false;
        var user = await _db.Users
            .Include(u => u.UserRoles)
            .ThenInclude(ur => ur.Role)
            .FirstOrDefaultAsync(u => u.Id == UserId.Value, ct);
        return user?.UserRoles.Any(ur => ur.Role.Name == RoleSeeder.RoleAdmin) ?? false;
    }

    [HttpGet("campaigns/pending")]
    public async Task<IActionResult> GetPendingCampaigns(CancellationToken ct)
    {
        if (!await IsAdminAsync(ct))
            return Forbid();

        var list = await _db.Campaigns
            .Include(c => c.Owner)
            .Where(c => c.Status == "Pending")
            .OrderBy(c => c.Id)
            .Select(c => new
            {
                c.Id,
                c.Title,
                c.Description,
                c.ImpactGoal,
                c.Status,
                OwnerName = c.Owner.FullName,
                OwnerEmail = c.Owner.Email,
                OwnerId = c.OwnerUserId
            })
            .ToListAsync(ct);

        return Ok(list);
    }

    [HttpGet("demotion-requests/pending")]
    public async Task<IActionResult> GetPendingDemotionRequests(CancellationToken ct)
    {
        if (!await IsAdminAsync(ct))
            return Forbid();

        var list = await _db.AdminDemotionRequests
            .Include(r => r.TargetUser)
            .Include(r => r.CreatedByUser)
            .Where(r => r.Status == "Pending")
            .OrderBy(r => r.CreatedAt)
            .Select(r => new
            {
                r.Id,
                TargetId = r.TargetUserId,
                TargetName = r.TargetUser.FullName,
                TargetEmail = r.TargetUser.Email,
                CreatedById = r.CreatedByUserId,
                CreatedByName = r.CreatedByUser.FullName,
                r.ApprovalsCount,
                r.Status,
                r.CreatedAt
            })
            .ToListAsync(ct);

        return Ok(list);
    }

    [HttpPost("admins/{targetUserId:int}/demote")]
    public async Task<IActionResult> CreateDemotionRequest(int targetUserId, CancellationToken ct)
    {
        if (!await IsAdminAsync(ct))
            return Forbid();

        if (UserId is null) return Forbid();

        if (UserId.Value == targetUserId)
            return BadRequest(new { error = "You cannot request removal of your own admin rights." });

        var target = await _db.Users
            .Include(u => u.UserRoles)
            .ThenInclude(ur => ur.Role)
            .FirstOrDefaultAsync(u => u.Id == targetUserId, ct);
        if (target is null) return NotFound(new { error = "Target user not found." });

        var isTargetAdmin = target.UserRoles.Any(ur => ur.Role.Name == RoleSeeder.RoleAdmin);
        if (!isTargetAdmin)
            return BadRequest(new { error = "Target user is not an admin." });

        var adminCount = await _db.UserRoles
            .Include(ur => ur.Role)
            .CountAsync(ur => ur.Role.Name == RoleSeeder.RoleAdmin, ct);
        if (adminCount <= 1)
            return BadRequest(new { error = "Cannot remove the last remaining admin." });

        var existingPending = await _db.AdminDemotionRequests
            .FirstOrDefaultAsync(r => r.TargetUserId == targetUserId && r.Status == "Pending", ct);
        if (existingPending is not null)
            return Ok(new { message = "Demotion request already exists.", requestId = existingPending.Id });

        var req = new AdminDemotionRequest
        {
            TargetUserId = targetUserId,
            CreatedByUserId = UserId.Value,
            Status = "Pending",
            ApprovalsCount = 0,
            CreatedAt = DateTime.UtcNow
        };
        _db.AdminDemotionRequests.Add(req);
        await _db.SaveChangesAsync(ct);

        return Ok(new { requestId = req.Id, status = req.Status });
    }

    [HttpPost("demotion-requests/{id:int}/approve")]
    public async Task<IActionResult> ApproveDemotionRequest(int id, CancellationToken ct)
    {
        if (!await IsAdminAsync(ct))
            return Forbid();

        if (UserId is null) return Forbid();

        var req = await _db.AdminDemotionRequests
            .Include(r => r.TargetUser)
            .Include(r => r.Approvals)
            .FirstOrDefaultAsync(r => r.Id == id, ct);
        if (req is null) return NotFound(new { error = "Request not found." });
        if (req.Status != "Pending") return BadRequest(new { error = "Request is not pending." });

        var alreadyApproved = req.Approvals.Any(a => a.ApprovedByUserId == UserId.Value);
        if (alreadyApproved)
            return Ok(new { message = "You have already approved this request." });

        var approval = new AdminDemotionApproval
        {
            RequestId = req.Id,
            ApprovedByUserId = UserId.Value,
            ApprovedAt = DateTime.UtcNow
        };
        _db.AdminDemotionApprovals.Add(approval);

        req.ApprovalsCount = req.Approvals.Count + 1;

        const int requiredApprovals = 2;
        if (req.ApprovalsCount >= requiredApprovals)
        {
            var adminRole = await _db.Roles.FirstOrDefaultAsync(r => r.Name == RoleSeeder.RoleAdmin, ct);
            if (adminRole is null)
                return StatusCode(500, new { error = "Admin role not found." });

            var userRole = await _db.UserRoles
                .FirstOrDefaultAsync(ur => ur.UserId == req.TargetUserId && ur.RoleId == adminRole.Id, ct);
            if (userRole is not null)
            {
                _db.UserRoles.Remove(userRole);
            }

            // Ensure at least one admin remains
            var remainingAdminCount = await _db.UserRoles
                .CountAsync(ur => ur.RoleId == adminRole.Id, ct);
            if (remainingAdminCount == 0)
                return BadRequest(new { error = "Cannot remove admin rights; at least one admin is required." });

            req.Status = "Approved";
        }

        await _db.SaveChangesAsync(ct);

        return Ok(new { id = req.Id, status = req.Status, approvals = req.ApprovalsCount });
    }

    [HttpPost("campaigns/{id:int}/approve")]
    public async Task<IActionResult> ApproveCampaign(int id, CancellationToken ct)
    {
        if (!await IsAdminAsync(ct))
            return Forbid();

        var campaign = await _db.Campaigns.FindAsync(new object[] { id }, ct);
        if (campaign is null) return NotFound(new { error = "Campaign not found." });
        if (campaign.Status != "Pending") return BadRequest(new { error = "Campaign is not pending." });

        campaign.Status = "Approved";
        await _db.SaveChangesAsync(ct);
        return Ok(new { id = campaign.Id, status = campaign.Status });
    }

    [HttpPost("campaigns/{id:int}/reject")]
    public async Task<IActionResult> RejectCampaign(int id, CancellationToken ct)
    {
        if (!await IsAdminAsync(ct))
            return Forbid();

        var campaign = await _db.Campaigns.FindAsync(new object[] { id }, ct);
        if (campaign is null) return NotFound(new { error = "Campaign not found." });
        if (campaign.Status != "Pending") return BadRequest(new { error = "Campaign is not pending." });

        campaign.Status = "Rejected";
        await _db.SaveChangesAsync(ct);
        return Ok(new { id = campaign.Id, status = campaign.Status });
    }

    [HttpGet("users")]
    public async Task<IActionResult> GetUsers(CancellationToken ct)
    {
        if (!await IsAdminAsync(ct))
            return Forbid();

        var list = await _db.Users
            .Include(u => u.UserRoles)
            .ThenInclude(ur => ur.Role)
            .OrderBy(u => u.Id)
            .Select(u => new
            {
                u.Id,
                u.FullName,
                u.Email,
                Roles = u.UserRoles.Select(ur => ur.Role.Name).ToList()
            })
            .ToListAsync(ct);

        return Ok(list);
    }

    [HttpPost("users/{userId:int}/role")]
    public async Task<IActionResult> AssignRole(int userId, [FromBody] AssignRoleRequest req, CancellationToken ct)
    {
        if (!await IsAdminAsync(ct))
            return Forbid();

        if (string.IsNullOrWhiteSpace(req?.RoleName))
            return BadRequest(new { error = "Role name is required." });

        var role = await _db.Roles.FirstOrDefaultAsync(r => r.Name == req.RoleName.Trim(), ct);
        if (role is null)
            return BadRequest(new { error = "Role not found. Use 'Admin' or 'Member'." });

        var user = await _db.Users.Include(u => u.UserRoles).FirstOrDefaultAsync(u => u.Id == userId, ct);
        if (user is null) return NotFound(new { error = "User not found." });

        if (user.UserRoles.Any(ur => ur.RoleId == role.Id))
            return Ok(new { message = "User already has this role." });

        _db.UserRoles.Add(new UserRole { UserId = user.Id, RoleId = role.Id });
        await _db.SaveChangesAsync(ct);

        return Ok(new { userId = user.Id, roleName = role.Name });
    }
}

public record AssignRoleRequest(string RoleName);
