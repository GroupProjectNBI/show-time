
namespace WebApp;

public static class PasswordResetHandler
{
    public static void Start()
    {
        // Er egen mailadress dit kundtjänst-mailen ska skickas
        string bioMail = "showtimecinemainfo@gmail.com";

        App.MapPost("/api/contact", (HttpContext context, JsonElement bodyJson) =>
        {
            var body = JSON.Parse(bodyJson.ToString());

            // 1. Hämta data från frontend
            string name = body.name?.ToString() ?? "Anonym";
            string email = body.email?.ToString() ?? "Ingen adress";
            string message = body.message?.ToString() ?? "";

            // 2. Skapa den "snygga designen" som matchar din Mailpit-bild
            string subject = $"Formulär fråga från - {name}";
            string htmlBody = $@"
        <div style='background-color: #1a1a1a; color: #ffffff; font-family: sans-serif; padding: 40px; border-radius: 20px; max-width: 600px;'>
            <h1 style='color: #C6A96A; border-bottom: 1px solid #C6A96A; padding-bottom: 10px; font-size: 24px; margin-top: 0;'>Nytt meddelande från webben</h1>
            
            <p style='font-size: 16px; margin-top: 20px;'>
                <strong style='color: #ffffff;'>Från:</strong> {name} (<a href='mailto:{email}' style='color: #5b9bd5; text-decoration: none;'>{email}</a>)
            </p>
            
            <div style='background-color: rgba(255,255,255,0.05); padding: 20px; border-radius: 10px; margin-top: 20px; font-style: italic; color: #e0e0e0; border: 1px solid rgba(255,255,255,0.1);'>
                ""{message}""
            </div>
            
            <p style='margin-top: 30px; font-size: 12px; color: #888;'>Detta mail skickades via kontaktformuläret på Show-Time FAQ-sida.</p>
        </div>
    ";

            // 3. VIKTIGT: Skicka mailet till ER, inte till kunden!
            // Vi lägger koden i en try-catch så att inte servern kraschar om mailet failar
            try
            {
                // Skickas till: bioMail (ni), Ämne: subject, Innehåll: htmlBody
                EmailService.SendEmail(bioMail, subject, htmlBody);
                return RestResult.Parse(context, new { success = true, message = "Mail skickat till systemet!" });
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Kunde inte skicka kontaktformulär: {ex.Message}");
                return RestResult.Parse(context, new { error = "Kunde inte skicka mailet just nu. Försök igen senare." });
            }
        });


        App.MapPost("/api/request-password-reset", (HttpContext context, JsonElement bodyJson) =>
           {
               var body = JSON.Parse(bodyJson.ToString());

               // 1. Hämta email och tvinga den till en ren sträng direkt
               string email = body.email != null ? body.email.ToString() : "";

               if (string.IsNullOrEmpty(email))
               {
                   return RestResult.Parse(context, new { error = "Ingen e-postadress angavs." });
               }

               // 2. Kolla användaren (Använd @email!)
               var user = SQLQueryOne("SELECT * FROM User WHERE email = @email", new { email = email }, context);

               if (user == null || user.HasKey("error"))
               {
                   return RestResult.Parse(context, new { success = true, message = "Om e-postadressen finns i vårt system har en kod skickats." });
               }

               // 3. Generera kod och gör om datum till STRÄNG för att undvika Stack Overflow
               Random rnd = new Random();
               string code = rnd.Next(100000, 999999).ToString();
               string expiresAt = DateTime.Now.AddMinutes(15).ToString("yyyy-MM-dd HH:mm:ss");

               // 4. Kör SQL (Använd @ istället för $)
               SQLQueryOne("DELETE FROM PasswordReset WHERE email = @email", new { email = email }, context);

               var insertResult = SQLQueryOne(
                   "INSERT INTO PasswordReset (email, code, expiresAt) VALUES (@email, @code, @expiresAt)",
                   new { email = email, code = code, expiresAt = expiresAt },
                   context
               );

               // 5. Skicka mailet
               string subject = "Återställning av lösenord - Show-Time";
               string htmlBody = $@"
            <div style='background: #121212; color: white; padding: 20px; font-family: sans-serif;'>
                <h2 style='color: #e50914;'>Återställ lösenord</h2>
                <p>Din engångskod för att återställa lösenordet är:</p>
                <h1 style='color: #ffcc00; letter-spacing: 5px;'>{code}</h1>
                <p>Koden är giltig i 15 minuter.</p>
            </div>";
               EmailService.SendEmail(subject, htmlBody, email);

               return RestResult.Parse(context, new { success = true, message = "En återställningskod har skickats!" });
           });





        // 2. VERIFIERA KOD OCH BYT LÖSENORD
        App.MapPost("/api/reset-password", (HttpContext context, JsonElement bodyJson) =>
        {
            var body = JSON.Parse(bodyJson.ToString());

            string email = body.email != null ? (string)body.email : "";
            string code = body.code != null ? (string)body.code : "";
            // VIKTIGT: Här hämtar vi det som 'newPassword' från din frontend
            string newPassword = body.newPassword != null ? (string)body.newPassword : "";

            if (string.IsNullOrEmpty(email) || string.IsNullOrEmpty(code) || string.IsNullOrEmpty(newPassword))
            {
                return RestResult.Parse(context, new { error = "Alla fält måste fyllas i." });
            }

            // Kolla koden i databasen
            var resetEntry = SQLQueryOne(
                "SELECT * FROM PasswordReset WHERE email = @email AND code = @code AND expiresAt > NOW()",
                new { email = email, code = code },
                context
            );

            if (resetEntry == null || resetEntry.HasKey("error"))
            {
                return RestResult.Parse(context, new { error = "Ogiltig eller utgången kod." });
            }

            // --- MAGIN HÄNDER HÄR: Vi använder DIN befintliga Password-klass! ---
            string newHashedPassword = Password.Encrypt(newPassword);

            // Uppdatera användaren
            SQLQueryOne(
                "UPDATE User SET password = @newHashedPassword WHERE email = @email",
                new { newHashedPassword = newHashedPassword, email = email },
                context
            );

            // Städa bort koden
            SQLQueryOne("DELETE FROM PasswordReset WHERE email = @email", new { email = email }, context);

            return RestResult.Parse(context, new { success = true, message = "Lösenordet har uppdaterats!" });
        });
    }
}
