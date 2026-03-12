
namespace WebApp;

public static class PasswordResetHandler
{
    public static void Start()
    {

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

               EmailService.SendEmail(email, subject, htmlBody);

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
