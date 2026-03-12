using MailKit.Net.Smtp;
using MailKit.Security; // Glöm inte denna för SecureSocketOptions!
using MimeKit;

namespace WebApp;

static class EmailService
{
    public static void SendEmail(string to, string subject, string body)
    {
        // 1. Hitta filen (Vi behåller din logik men dubbelkolla path!)
        var configPath = Path.Combine(AppContext.BaseDirectory, "..", "..", "..", "db-config.json");
        var configJson = File.ReadAllText(configPath);
        var config = JSON.Parse(configJson);
        // Plockar ut konfigurationen från "db-config.json"
        string smtpServer = config.smtpServer;
        int smtpPort = Convert.ToInt32(config.smtpPort);
        string emailUsername = config.emailUsername;
        string emailPassword = config.emailPassword;

        var message = new MimeMessage();
        message.From.Add(MailboxAddress.Parse(emailUsername));
        message.To.Add(MailboxAddress.Parse(to));
        message.Subject = subject;
        message.Body = new TextPart("html") { Text = body };

        using (var client = new SmtpClient())
        {
            // --- FIX 1: Använd StartTls för port 587 --- SecureSocketOptions.StartTls
            client.Connect(smtpServer, smtpPort, SecureSocketOptions.Auto);

            // // --- FIX 2: Autentisera ---
            // client.Authenticate(emailUsername, emailPassword);

            client.Send(message);
            client.Disconnect(true);
        }
    }
}