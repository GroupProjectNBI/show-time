using MailKit.Net.Smtp;
using MailKit.Security;
using MimeKit;

namespace WebApp;

static class EmailService
{
    public static void SendEmail(string to, string subject, string body)
    {
        // 1. Försök hämta från miljövariabler (Docker/Vault) först
        string smtpServer = Environment.GetEnvironmentVariable("smtpServer");
        string smtpPortStr = Environment.GetEnvironmentVariable("smtpPort");
        string emailUsername = Environment.GetEnvironmentVariable("emailUsername");
        string emailPassword = Environment.GetEnvironmentVariable("emailPassword");

        // 2. Om de är tomma (lokalt), läs från db-config.json
        if (string.IsNullOrEmpty(smtpServer) || string.IsNullOrEmpty(emailUsername))
        {
            try
            {
                var configPath = Path.Combine(AppContext.BaseDirectory, "..", "..", "..", "db-config.json");
                if (!File.Exists(configPath)) configPath = "db-config.json";
                var configJson = File.ReadAllText(configPath);
                var config = JSON.Parse(configJson);

                // FIX: Vi tvingar värdena till rätt datatyp för att undvika smyg-kraschar!
                smtpServer = (string)config.smtpServer;
                smtpPortStr = config.smtpPort?.ToString(); // Porten är ofta en siffra i JSON, konvertera till string
                emailUsername = (string)config.emailUsername;
                emailPassword = (string)config.emailPassword;
            }
            catch (Exception ex)
            {
                // FIX: Nu ser vi det VERKLIGA felet om det kraschar igen!
                Console.WriteLine($"[EmailService] Varning: Saknar inställningar för SMTP! Fel: {ex.Message}");
                return;
            }
        }

        int smtpPort = Convert.ToInt32(smtpPortStr ?? "587");

        var message = new MimeMessage();
        message.From.Add(MailboxAddress.Parse(emailUsername));
        message.To.Add(MailboxAddress.Parse(to));
        message.Subject = subject;
        message.Body = new TextPart("html") { Text = body };

        using (var client = new SmtpClient())
        {
            client.Connect(smtpServer, smtpPort, SecureSocketOptions.StartTls);
            client.Authenticate(emailUsername, emailPassword);
            client.Send(message);
            client.Disconnect(true);
        }
    }
}