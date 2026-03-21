namespace SocialMediaApp.Models;

public class AdminDemotionRequest
{
    public int Id { get; set; }

    public int TargetUserId { get; set; }
    public User TargetUser { get; set; } = null!;

    public int CreatedByUserId { get; set; }
    public User CreatedByUser { get; set; } = null!;

    public string Status { get; set; } = "Pending";

    public int ApprovalsCount { get; set; }

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    public ICollection<AdminDemotionApproval> Approvals { get; set; } = [];
}

public class AdminDemotionApproval
{
    public int Id { get; set; }

    public int RequestId { get; set; }
    public AdminDemotionRequest Request { get; set; } = null!;

    public int ApprovedByUserId { get; set; }
    public User ApprovedByUser { get; set; } = null!;

    public DateTime ApprovedAt { get; set; } = DateTime.UtcNow;
}

