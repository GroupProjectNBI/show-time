using MailKit.Net.Smtp;
using MailKit.Security;
using MimeKit;

namespace WebApp;

static class EmailService
{
    // --- 1. Uppdaterad Config-funktion med Mailpit-switch ---
    private static (string Server, int Port, string User, string Pass, bool UseSsl) GetSmtpConfig()
    {
        // 1. Hämta från miljövariabler (Docker/Vault)
        string useMailPitStr = Environment.GetEnvironmentVariable("useMailPit");
        bool useMailPit = useMailPitStr?.ToLower() == "true";

        string smtpServer = Environment.GetEnvironmentVariable("smtpServer");
        string smtpPortStr = Environment.GetEnvironmentVariable("smtpPort");
        string emailUsername = Environment.GetEnvironmentVariable("emailUsername");
        string emailPassword = Environment.GetEnvironmentVariable("emailPassword");

        // 2. Om tomt, hämta från din db-config.json
        if (string.IsNullOrEmpty(smtpServer) || string.IsNullOrEmpty(emailUsername))
        {
            try
            {
                var configPath = Path.Combine(AppContext.BaseDirectory, "..", "..", "..", "db-config.json");
                if (!File.Exists(configPath)) configPath = "db-config.json";

                var configJson = File.ReadAllText(configPath);
                var config = JSON.Parse(configJson);

                // Kolla useMailPit i JSON om den inte fanns i miljövariabler
                if (string.IsNullOrEmpty(useMailPitStr) && config.useMailPit != null)
                    useMailPit = (bool)config.useMailPit;

                smtpServer = (string)config.smtpServer;
                smtpPortStr = config.smtpPort?.ToString();
                emailUsername = (string)config.emailUsername;
                emailPassword = (string)config.emailPassword;
            }
            catch (Exception ex)
            {
                Console.WriteLine($"[EmailService] Config error: {ex.Message}");
                throw;
            }
        }

        // 3. Konvertera porten (använd din config-port, annars 587 som fallback)
        int smtpPort = Convert.ToInt32(smtpPortStr ?? "587");

        // 4. Logik för Mailpit vs Gmail
        if (useMailPit)
        {
            // Använder dina värden (jarllindquist.com & 1025) men skippar SSL
            Console.WriteLine($"[EmailService] TESTLÄGE -> Skickar till Mailpit på {smtpServer}:{smtpPort}");
            return (smtpServer, smtpPort, emailUsername, "", false);
        }

        // Annars: Gmail/Produktion med SSL och lösenord
        return (smtpServer, smtpPort, emailUsername, emailPassword, true);
    }

    // --- 2. Uppdaterad metod för mejl utan bilagor ---
    public static void SendEmail(string subject, string body, string? to = null)
    {
        var config = GetSmtpConfig();
        string recipient = string.IsNullOrEmpty(to) ? config.User : to;

        var message = new MimeMessage();
        message.From.Add(MailboxAddress.Parse(config.User));
        message.To.Add(MailboxAddress.Parse(recipient));
        message.Subject = subject;
        message.Body = new TextPart("html") { Text = body };

        using (var client = new SmtpClient())
        {
            // Välj SSL eller inte beroende på om vi kör Mailpit
            var options = config.UseSsl ? SecureSocketOptions.StartTls : SecureSocketOptions.None;
            client.Connect(config.Server, config.Port, options);

            // Logga bara in om det faktiskt finns ett lösenord (Gmail)
            if (!string.IsNullOrEmpty(config.Pass))
            {
                client.Authenticate(config.User, config.Pass);
            }

            client.Send(message);
            client.Disconnect(true);
        }
    }

    // --- 3. Uppdaterad metod för mejl med bilagor ---
    public static void SendEmailWithAttachments(
        string subject,
        string body,
        List<(string FileName, byte[] Data)> attachments,
        string? to = null)
    {
        var config = GetSmtpConfig();
        string recipient = string.IsNullOrEmpty(to) ? config.User : to;

        var message = new MimeMessage();
        message.From.Add(MailboxAddress.Parse(config.User));
        message.To.Add(MailboxAddress.Parse(recipient));
        message.Subject = subject;

        var builder = new BodyBuilder { HtmlBody = body };
        foreach (var att in attachments)
        {
            builder.Attachments.Add(att.FileName, att.Data);
        }
        message.Body = builder.ToMessageBody();

        using (var client = new SmtpClient())
        {
            // Samma logik här: Skippa SSL och Auth om vi kör Mailpit
            var options = config.UseSsl ? SecureSocketOptions.StartTls : SecureSocketOptions.None;
            client.Connect(config.Server, config.Port, options);

            if (!string.IsNullOrEmpty(config.Pass))
            {
                client.Authenticate(config.User, config.Pass);
            }

            client.Send(message);
            client.Disconnect(true);
        }
    }
}