using Microsoft.AspNetCore.Mvc.ModelBinding.Validation;
namespace SocialMediaApp.Models;

public class Campaign
{
    public int Id { get; set; }

    public string Title { get; set; } = string.Empty;

    public string Description { get; set; } = string.Empty;

    public string ImpactGoal { get; set; } = string.Empty;

    public string? CoverImagePath { get; set; }

    public string Status { get; set; } = "Pending";

    // Primary FK used by EF to link to Owner
    public int OwnerId { get; set; }

    public int OwnerUserId { get; set; }
    [ValidateNever]
    public User? Owner { get; set; }

    [ValidateNever]
    public ICollection<CampaignImage> Images { get; set; } = [];
}

