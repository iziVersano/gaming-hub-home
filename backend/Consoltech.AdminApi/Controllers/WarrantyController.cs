using Consoltech.AdminApi.Data;
using Consoltech.AdminApi.Models;
using Consoltech.AdminApi.Services;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System;
using System.Linq;
using System.Threading.Tasks;

namespace Consoltech.AdminApi.Controllers
{
    [ApiController]
    [Route("api/warranty")]
    public class WarrantyController : ControllerBase
    {
        private readonly ProductsDbContext _dbContext;
        private readonly LocalStorageService _localStorageService;

        public WarrantyController(ProductsDbContext dbContext, LocalStorageService localStorageService)
        {
            _dbContext = dbContext;
            _localStorageService = localStorageService;
        }

        [HttpPost]
        [Consumes("multipart/form-data")]
        public async Task<IActionResult> SubmitWarranty(
            [FromForm] string customerName,
            [FromForm] string email,
            [FromForm] string product,
            [FromForm] string serialNumber,
            [FromForm] IFormFile? invoice)
        {
            try
            {
                string? invoiceUrl = null;
                string? invoiceFileName = null;

                if (invoice != null)
                {
                    invoiceFileName = invoice.FileName;
                    using var stream = invoice.OpenReadStream();
                    invoiceUrl = await _localStorageService.SaveInvoiceAsync(stream, invoice.FileName);
                }

                var entity = new WarrantySubmissionEntity
                {
                    CustomerName = customerName,
                    Email = email,
                    Product = product,
                    SerialNumber = serialNumber,
                    InvoiceUrl = invoiceUrl,
                    InvoiceFileName = invoiceFileName
                };

                _dbContext.WarrantySubmissions.Add(entity);
                await _dbContext.SaveChangesAsync();

                return Ok(new { success = true, message = "Warranty registration submitted successfully" });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { success = false, message = $"Error submitting warranty: {ex.Message}" });
            }
        }

        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            try
            {
                var records = await _dbContext.WarrantySubmissions
                    .OrderByDescending(w => w.CreatedAt)
                    .ToListAsync();
                return Ok(records);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { success = false, message = $"Error retrieving records: {ex.Message}" });
            }
        }

        [HttpDelete("{identifier}")]
        public async Task<IActionResult> DeleteWarranty(string identifier)
        {
            try
            {
                // Find record by RowKey or SerialNumber
                var record = await _dbContext.WarrantySubmissions
                    .FirstOrDefaultAsync(w => w.RowKey == identifier || w.SerialNumber == identifier);

                if (record == null)
                {
                    return NotFound(new { success = false, message = "Warranty record not found" });
                }

                // Delete associated invoice file if it exists
                if (!string.IsNullOrEmpty(record.InvoiceUrl))
                {
                    _localStorageService.DeleteInvoiceFile(record.InvoiceUrl);
                }

                _dbContext.WarrantySubmissions.Remove(record);
                await _dbContext.SaveChangesAsync();

                return Ok(new { success = true, message = "Warranty record deleted successfully" });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { success = false, message = $"Error deleting warranty: {ex.Message}" });
            }
        }
    }
}
