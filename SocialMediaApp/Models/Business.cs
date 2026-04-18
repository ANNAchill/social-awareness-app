using Microsoft.AspNetCore.Mvc.ModelBinding.Validation;
namespace SocialMediaApp.Models;

public class Business
{
    public int Id { get; set; }

    public string Name { get; set; } = string.Empty;

    public string Industry { get; set; } = string.Empty;

    public string? Website { get; set; }

    public string? City { get; set; }

    // Primary FK used by EF to link to Owner.
    public int OwnerId { get; set; }

    // Kept temporarily for compatibility with the existing schema / UI payloads.
    public int OwnerUserId { get; set; }

    [ValidateNever]
    public User? Owner { get; set; }
}
