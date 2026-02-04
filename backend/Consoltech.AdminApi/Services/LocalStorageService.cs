using Consoltech.AdminApi.Models;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text.Json;
using System.Threading.Tasks;

namespace Consoltech.AdminApi.Services
{
    public class LocalStorageService
    {
        private readonly string _uploadsDirectory;
        private readonly string _dataFilePath;

        public LocalStorageService()
        {
            _uploadsDirectory = Path.Combine(Directory.GetCurrentDirectory(), "AppData", "warranty-uploads");
            _dataFilePath = Path.Combine(Directory.GetCurrentDirectory(), "AppData", "warranty-records.json");

            // Ensure directories exist
            Directory.CreateDirectory(_uploadsDirectory);
            Directory.CreateDirectory(Path.GetDirectoryName(_dataFilePath));

            // Ensure data file exists
            if (!File.Exists(_dataFilePath))
            {
                File.WriteAllText(_dataFilePath, "[]");
            }
        }

        public async Task<string> SaveInvoiceAsync(Stream fileStream, string fileName)
        {
            var uniqueFileName = $"{Guid.NewGuid()}_{fileName}";
            var filePath = Path.Combine(_uploadsDirectory, uniqueFileName);

            using (var fileStreamOut = File.Create(filePath))
            {
                await fileStream.CopyToAsync(fileStreamOut);
            }

            // Return relative path
            return $"/warranty-uploads/{uniqueFileName}";
        }

        public async Task SaveWarrantyRecordAsync(WarrantySubmissionEntity entity)
        {
            var records = await GetAllRecordsAsync();
            records.Add(entity);

            var json = JsonSerializer.Serialize(records, new JsonSerializerOptions
            {
                WriteIndented = true
            });

            await File.WriteAllTextAsync(_dataFilePath, json);
        }

        public async Task<List<WarrantySubmissionEntity>> GetAllRecordsAsync()
        {
            var json = await File.ReadAllTextAsync(_dataFilePath);
            var records = JsonSerializer.Deserialize<List<WarrantySubmissionEntity>>(json) ?? new List<WarrantySubmissionEntity>();
            return records.OrderByDescending(x => x.CreatedAt).ToList();
        }

        public async Task<bool> DeleteWarrantyRecordAsync(string identifier)
        {
            var records = await GetAllRecordsAsync();

            // Find record by RowKey (ID) or SerialNumber
            var recordToDelete = records.FirstOrDefault(r =>
                r.RowKey == identifier || r.SerialNumber == identifier);

            if (recordToDelete == null)
            {
                return false;
            }

            // Delete associated invoice file if it exists
            if (!string.IsNullOrEmpty(recordToDelete.InvoiceUrl))
            {
                var fileName = Path.GetFileName(recordToDelete.InvoiceUrl);
                var filePath = Path.Combine(_uploadsDirectory, fileName);
                if (File.Exists(filePath))
                {
                    File.Delete(filePath);
                }
            }

            // Remove record from list
            records.Remove(recordToDelete);

            // Save updated list
            var json = JsonSerializer.Serialize(records, new JsonSerializerOptions
            {
                WriteIndented = true
            });

            await File.WriteAllTextAsync(_dataFilePath, json);

            return true;
        }

        /// <summary>
        /// Delete an invoice file from the uploads directory.
        /// Used by WarrantyController when deleting warranty records from the database.
        /// </summary>
        public void DeleteInvoiceFile(string invoiceUrl)
        {
            if (string.IsNullOrEmpty(invoiceUrl)) return;

            var fileName = Path.GetFileName(invoiceUrl);
            var filePath = Path.Combine(_uploadsDirectory, fileName);
            if (File.Exists(filePath))
            {
                File.Delete(filePath);
            }
        }
    }
}
