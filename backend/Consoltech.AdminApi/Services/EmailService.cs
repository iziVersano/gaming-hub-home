using Microsoft.Extensions.Configuration;
using System;
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
        private readonly bool _isConfigured;

        public EmailService(IConfiguration configuration)
        {
            _configuration = configuration;
            _smtpHost = configuration["Email:SmtpHost"];
            _smtpPort = int.TryParse(configuration["Email:SmtpPort"], out var port) ? port : 587;
            _smtpUser = configuration["Email:SmtpUser"];
            _smtpPassword = configuration["Email:SmtpPassword"];
            _fromEmail = configuration["Email:FromEmail"] ?? "noreply@consoltech.co.il";
            _fromName = configuration["Email:FromName"] ?? "Consoltech";

            _isConfigured = !string.IsNullOrEmpty(_smtpHost) &&
                           !string.IsNullOrEmpty(_smtpUser) &&
                           !string.IsNullOrEmpty(_smtpPassword);
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
                <a href='mailto:warranty@consoltech.co.il' style='color: #c40000;'>warranty@consoltech.co.il</a>
            </p>
        </div>
    </div>
</body>
</html>";
        }
    }
}
