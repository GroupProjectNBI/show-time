namespace WebApp;

public static class LoginRoutes
{
    private static Obj GetUser(HttpContext context)
    {
        return Session.Get(context, "user");
    }

    public static void Start()
    {
        App.MapPost("/api/login", (HttpContext context, JsonElement bodyJson) =>
{
    var user = GetUser(context);
    var body = JSON.Parse(bodyJson.ToString());

    // Om en användare redan är inloggad
    if (user != null)
    {
        var already = new { error = "A user is already logged in." };
        return RestResult.Parse(context, already);
    }

    // Hitta användaren i DB (Notera: Tabellen heter 'User' i din DB-config)
    var dbUser = SQLQueryOne(
        "SELECT * FROM User WHERE email = @email",
        new { body.email }
    );

    if (dbUser == null)
    {
        return RestResult.Parse(context, new { error = "No such user." });
    }

    // Verifiera lösenord
    if (!Password.Verify(
        (string)body.password,
        (string)dbUser.password
    ))
    {
        return RestResult.Parse(context, new { error = "Password mismatch." });
    }

    // Ta bort lösenordet och spara i sessionen
    dbUser.Delete("password");
    Session.Set(context, "user", dbUser);

    // --- HÄR SKICKAR VI MAILET ---
    Console.WriteLine("--- Försöker skicka inloggningsmail ---");
    try
    {
        // Vi använder mailadressen från body.email
        string userEmail = (string)body.email;
        string subject = "Inloggningsbekräftelse - Show-Time";
        string bodyHtml = $@"
            <div style='font-family: sans-serif; background-color: #121212; color: white; padding: 20px; border-radius: 10px;'>
                <h1 style='color: #e50914;'>Show-Time</h1>
                <p>Hej! Du har precis loggat in på Show-Time Malmö.</p>
                <p>Om detta inte var du, vänligen kontakta oss.</p>
            </div>";

        EmailService.SendEmail(userEmail, subject, bodyHtml);
        Console.WriteLine("Mail skickat till Mailpit!");
    }
    catch (Exception ex)
    {
        Console.WriteLine("Kunde inte skicka mail: " + ex.Message);
    }

    return RestResult.Parse(context, dbUser!);
});        
App.MapGet("/api/login", (HttpContext context) =>
        {
            var user = GetUser(context);
            return RestResult.Parse(context, user != null ?
                user : new { error = "No user is logged in." });
        });

        App.MapDelete("/api/login", (HttpContext context) =>
        {
            var user = GetUser(context);

            // Delete the user from the session
            Session.Set(context, "user", null);

            return RestResult.Parse(context, user == null ?
                new { error = "No user is logged in." } :
                new { status = "Successful logout." }
            );
        });
    }
}