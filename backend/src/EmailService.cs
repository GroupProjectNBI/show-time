using MailKit.Net.Smtp;
using MimeKit;
using System;
using System.IO;

namespace WebApp
{
    public static class EmailService
    {
        public static void SendEmail(string to, string subject, string body)
        {
            try 
            {
                var configPath = Path.Combine(AppContext.BaseDirectory, "..", "..", "..", "db-config.json");
                var configJson = File.ReadAllText(configPath);
                var config = JSON.Parse(configJson);

                string smtpServer = config.smtpServer; 
                int smtpPort = Convert.ToInt32(config.smtpPort); 
                string emailUsername = config.emailUsername; 

                var message = new MimeMessage();
                message.From.Add(MailboxAddress.Parse(emailUsername));
                message.To.Add(MailboxAddress.Parse(to));
                message.Subject = subject;
                message.Body = new TextPart("html") { Text = body };

                using (var client = new SmtpClient())
                {
                    client.Connect(smtpServer, smtpPort, false);
                    client.Send(message);
                    client.Disconnect(true);
                }
                Console.WriteLine($"Email sent to {to}");
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Email error: {ex.Message}");
            }
        }
    }
}