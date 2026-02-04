using System;
using System.ComponentModel.DataAnnotations;

namespace Consoltech.AdminApi.Models
{
    public class WarrantySubmissionEntity
    {
        [Key]
        public int Id { get; set; }

        // Legacy identifier (kept for API compatibility)
        public string RowKey { get; set; } = Guid.NewGuid().ToString();

        // Warranty form fields
        [Required]
        [MaxLength(200)]
        public string CustomerName { get; set; } = string.Empty;

        [Required]
        [MaxLength(200)]
        public string Email { get; set; } = string.Empty;

        [Required]
        [MaxLength(200)]
        public string Product { get; set; } = string.Empty;

        [Required]
        [MaxLength(100)]
        public string SerialNumber { get; set; } = string.Empty;

        // Invoice attachment
        [MaxLength(500)]
        public string? InvoiceUrl { get; set; }

        [MaxLength(255)]
        public string? InvoiceFileName { get; set; }

        // Metadata
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }
}
