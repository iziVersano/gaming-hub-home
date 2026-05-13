using Microsoft.Extensions.Configuration;
using System;
using System.IO;
using System.Net;
using System.Net.Mail;
using System.Threading.Tasks;

namespace Consoltech.AdminApi.Services
{
    public class EmailService
    {
        private readonly IConfiguration _configuration;
        private readonly string? _smtpHost;
        private readonly int _smtpPort;
        private readonly string? _smtpUser;
        private readonly string? _smtpPassword;
        private readonly string? _fromEmail;
        private readonly string? _fromName;
        private readonly string _salesEmail;
        private readonly bool _isConfigured;

        public EmailService(IConfiguration configuration)
        {
            _configuration = configuration;
            _smtpHost = configuration["Email:SmtpHost"] ?? Environment.GetEnvironmentVariable("SMTP_HOST");
            _smtpPort = int.TryParse(configuration["Email:SmtpPort"] ?? Environment.GetEnvironmentVariable("SMTP_PORT"), out var port) ? port : 587;
            _smtpUser = configuration["Email:SmtpUser"] ?? Environment.GetEnvironmentVariable("SMTP_USER");
            _smtpPassword = configuration["Email:SmtpPassword"] ?? Environment.GetEnvironmentVariable("SMTP_PASSWORD");
            _fromEmail = configuration["Email:FromEmail"] ?? Environment.GetEnvironmentVariable("SMTP_FROM_EMAIL") ?? "noreply@consoltech.co.il";
            _fromName = configuration["Email:FromName"] ?? Environment.GetEnvironmentVariable("SMTP_FROM_NAME") ?? "Consoltech";
            _salesEmail = configuration["Email:SalesEmail"] ?? Environment.GetEnvironmentVariable("SALES_EMAIL") ?? "sales@consoltech.co.il";

            _isConfigured = !string.IsNullOrEmpty(_smtpHost) &&
                           !string.IsNullOrEmpty(_smtpUser) &&
                           !string.IsNullOrEmpty(_smtpPassword);
        }

        public async Task<bool> SendWarrantyToSalesAsync(
            string customerName,
            string customerEmail,
            string product,
            string serialNumber,
            Stream? invoiceStream,
            string? invoiceFileName)
        {
            if (!_isConfigured)
            {
                Console.WriteLine("Email service not configured. Skipping sales notification.");
                return false;
            }

            try
            {
                using var client = new SmtpClient(_smtpHost, _smtpPort)
                {
                    Credentials = new NetworkCredential(_smtpUser, _smtpPassword),
                    EnableSsl = true
                };

                using var mailMessage = new MailMessage
                {
                    From = new MailAddress(_fromEmail!, _fromName),
                    Subject = $"רישום אחריות חדש - {product} ({serialNumber})",
                    IsBodyHtml = true,
                    Body = GenerateSalesEmailBody(customerName, customerEmail, product, serialNumber, invoiceFileName)
                };

                mailMessage.To.Add(_salesEmail);
                mailMessage.ReplyToList.Add(new MailAddress(customerEmail));

                if (invoiceStream != null && !string.IsNullOrEmpty(invoiceFileName))
                {
                    var attachment = new Attachment(invoiceStream, invoiceFileName);
                    mailMessage.Attachments.Add(attachment);
                    await client.SendMailAsync(mailMessage);
                    attachment.Dispose();
                }
                else
                {
                    await client.SendMailAsync(mailMessage);
                }

                Console.WriteLine($"Warranty submission forwarded to sales: {_salesEmail}");
                return true;
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Failed to send sales email: {ex.Message}");
                return false;
            }
        }

        private string GenerateSalesEmailBody(string customerName, string customerEmail, string product, string serialNumber, string? invoiceFileName)
        {
            var invoiceLine = string.IsNullOrEmpty(invoiceFileName)
                ? "<tr><td style='padding: 8px 0; color: #777;'>חשבונית:</td><td style='padding: 8px 0; color: #333;'>לא צורפה</td></tr>"
                : $"<tr><td style='padding: 8px 0; color: #777;'>חשבונית:</td><td style='padding: 8px 0; color: #333; font-weight: bold;'>{invoiceFileName} (מצורף)</td></tr>";

            return $@"
<!DOCTYPE html>
<html dir='rtl' lang='he'>
<head><meta charset='UTF-8'></head>
<body style='font-family: Arial, sans-serif; direction: rtl; text-align: right; background-color: #f5f5f5; margin: 0; padding: 20px;'>
    <div style='max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 8px; overflow: hidden;'>
        <div style='background: linear-gradient(135deg, #c40000, #a80000); padding: 24px; text-align: center;'>
            <h1 style='color: #ffffff; margin: 0; font-size: 22px;'>רישום אחריות חדש</h1>
        </div>
        <div style='padding: 24px;'>
            <table style='width: 100%; border-collapse: collapse;'>
                <tr><td style='padding: 8px 0; color: #777;'>שם הלקוח:</td><td style='padding: 8px 0; color: #333; font-weight: bold;'>{customerName}</td></tr>
                <tr><td style='padding: 8px 0; color: #777;'>אימייל:</td><td style='padding: 8px 0; color: #333; font-weight: bold;'><a href='mailto:{customerEmail}'>{customerEmail}</a></td></tr>
                <tr><td style='padding: 8px 0; color: #777;'>מוצר:</td><td style='padding: 8px 0; color: #333; font-weight: bold;'>{product}</td></tr>
                <tr><td style='padding: 8px 0; color: #777;'>מספר סידורי:</td><td style='padding: 8px 0; color: #333; font-weight: bold;'>{serialNumber}</td></tr>
                {invoiceLine}
            </table>
        </div>
    </div>
</body>
</html>";
        }

        public async Task<bool> SendWarrantyConfirmationAsync(
            string customerEmail,
            string customerName,
            string product,
            string serialNumber)
        {
            if (!_isConfigured)
            {
                Console.WriteLine("Email service not configured. Skipping email send.");
                return false;
            }

            try
            {
                using var client = new SmtpClient(_smtpHost, _smtpPort)
                {
                    Credentials = new NetworkCredential(_smtpUser, _smtpPassword),
                    EnableSsl = true
                };

                var mailMessage = new MailMessage
                {
                    From = new MailAddress(_fromEmail!, _fromName),
                    Subject = $"אישור רישום אחריות - {product} | Consoltech",
                    IsBodyHtml = true,
                    Body = GenerateWarrantyEmailBody(customerName, product, serialNumber)
                };

                mailMessage.To.Add(customerEmail);

                await client.SendMailAsync(mailMessage);
                Console.WriteLine($"Warranty confirmation email sent to {customerEmail}");
                return true;
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Failed to send email: {ex.Message}");
                return false;
            }
        }

        private string GenerateWarrantyEmailBody(string customerName, string product, string serialNumber)
        {
            return $@"
<!DOCTYPE html>
<html dir='rtl' lang='he'>
<head>
    <meta charset='UTF-8'>
    <meta name='viewport' content='width=device-width, initial-scale=1.0'>
</head>
<body style='font-family: Arial, sans-serif; direction: rtl; text-align: right; background-color: #f5f5f5; margin: 0; padding: 20px;'>
    <div style='max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 10px rgba(0,0,0,0.1);'>
        <!-- Header -->
        <div style='background: linear-gradient(135deg, #c40000, #a80000); padding: 30px; text-align: center;'>
            <h1 style='color: #ffffff; margin: 0; font-size: 24px;'>Consoltech</h1>
            <p style='color: #ffffff; margin: 10px 0 0 0; opacity: 0.9;'>אישור רישום אחריות</p>
        </div>

        <!-- Content -->
        <div style='padding: 30px;'>
            <h2 style='color: #333; margin-top: 0;'>שלום {customerName},</h2>

            <p style='color: #555; line-height: 1.6;'>
                תודה שרשמת את המוצר שלך לאחריות! קיבלנו את הפרטים שלך בהצלחה.
            </p>

            <div style='background-color: #f8f8f8; border-radius: 8px; padding: 20px; margin: 20px 0;'>
                <h3 style='color: #c40000; margin-top: 0;'>פרטי המוצר:</h3>
                <table style='width: 100%; border-collapse: collapse;'>
                    <tr>
                        <td style='padding: 8px 0; color: #777;'>מוצר:</td>
                        <td style='padding: 8px 0; color: #333; font-weight: bold;'>{product}</td>
                    </tr>
                    <tr>
                        <td style='padding: 8px 0; color: #777;'>מספר סידורי:</td>
                        <td style='padding: 8px 0; color: #333; font-weight: bold;'>{serialNumber}</td>
                    </tr>
                    <tr>
                        <td style='padding: 8px 0; color: #777;'>תקופת אחריות:</td>
                        <td style='padding: 8px 0; color: #333; font-weight: bold;'>12 חודשים</td>
                    </tr>
                </table>
            </div>

            <p style='color: #555; line-height: 1.6;'>
                האחריות שלך פעילה כעת. במידה ותזדקק לשירות או תמיכה, אנא צור קשר עם צוות התמיכה שלנו.
            </p>

            <div style='text-align: center; margin-top: 30px;'>
                <a href='https://consoltech.co.il/contact' style='display: inline-block; background-color: #c40000; color: #ffffff; text-decoration: none; padding: 12px 30px; border-radius: 6px; font-weight: bold;'>צור קשר</a>
            </div>
        </div>

        <!-- Footer -->
        <div style='background-color: #f8f8f8; padding: 20px; text-align: center; border-top: 1px solid #eee;'>
            <p style='color: #888; margin: 0; font-size: 14px;'>
                Consoltech Ltd. | Tel Aviv, Israel
            </p>
            <p style='color: #888; margin: 10px 0 0 0; font-size: 12px;'>
                <a href='mailto:sales@consoltech.co.il' style='color: #c40000;'>sales@consoltech.co.il</a>
            </p>
        </div>
    </div>
</body>
</html>";
        }
    }
}
