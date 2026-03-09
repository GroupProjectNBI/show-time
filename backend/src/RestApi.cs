namespace WebApp;

public static class RestApi
{
    public static void Start()
    {
        // 1. Hämta alla visningar från vyn (för dropdown-menyn)
        // App.MapGet("/api/v_screenings", (HttpContext context) =>
        // {
        //     var sql = "SELECT * FROM v_screenings";
        //     return RestResult.Parse(context, SQLQuery(sql, null, context));
        // });

        // // 2. Ta emot bokningen från formuläret och spara i tabellen Booking
        // App.MapPost("/api/Booking", (HttpContext context, JsonElement body) =>
        // {
        //     // Skapa ett unikt bokningsnummer som krävs i uppgiften
        //     string bookingNumber = Guid.NewGuid().ToString().Substring(0, 8).ToUpper();

        //     var sql = @"INSERT INTO Booking (bookingNumber, screeningId, userId) 
        //                 VALUES (@bookingNumber, @screeningId, (SELECT id FROM User LIMIT 1))";

        //     var parameters = new {
        //         bookingNumber = bookingNumber,
        //         screeningId = body.GetProperty("screeningId").GetInt32()
        //     };

        //     return RestResult.Parse(context, SQLQuery(sql, parameters, context));
        // });

        // 1. Specifik route för att hämta bokningsvyn




        App.MapGet("/api/{table}/{id}", (
            HttpContext context, string table, string id
        ) =>
            RestResult.Parse(context, SQLQueryOne(
                $"SELECT * FROM {table} WHERE id = @id",
                ReqBodyParse(table, Obj(new { id })).body,
                context
            ))
        );


        App.MapGet("/api/{table}", (
            HttpContext context, string table
        ) =>
        {
            var query = RestQuery.Parse(context.Request.Query);
            if (query.error != null)
            {
                return RestResult.Parse(context, Arr(Obj(new { error = query.error })));
            }
            var sql = $"SELECT * FROM {table}" + query.sql;
            return RestResult.Parse(context, SQLQuery(sql, query.parameters, context));
        });

        // POST-route för att spara ny data (t.ex. en ny bokning)
        App.MapPost("/api/{table}", (
            HttpContext context, string table, JsonElement bodyJson
        ) =>
        {
            var body = JSON.Parse(bodyJson.ToString());
            body.Delete("id");
            var parsed = ReqBodyParse(table, body);
            if (parsed.HasKey("error"))
            {
                return RestResult.Parse(context, parsed);
            }
            var columns = parsed.insertColumns;
            var values = parsed.insertValues;
            var sql = $"INSERT INTO {table}({columns}) VALUES({values})";
            var result = SQLQueryOne(sql, parsed.body, context);
            // Om INSERT lyckades utan fel, hämta det nya id:t och lägg till i resultatet som skickas tillbaka
            if (!result.HasKey("error"))
            {
                // Get the insert id and add to our result
                result.insertId = SQLQueryOne(
                    @$"SELECT id AS __insertId 
                       FROM {table} ORDER BY id DESC LIMIT 1"
                ).__insertId;
            }
            // --- LOGIK FÖR BOKNINGSBEKRÄFTELSE (MAIL) ---
            if (table == "Booking")
            {
                Console.WriteLine("--- Försöker skicka bokningsmail ---"); // DEBUG-INFO
                try
                {
                    // 1. Hämta användaren från sessionen
                    var sessionUser = Session.Get(context, "user");
                    string userEmail = sessionUser?.email;
                    // Kolla i terminalen om emailen hittas
                    Console.WriteLine("Användarens e-post från session: " + (userEmail ?? "INGEN EMAIL HITTAD"));

                    if (!string.IsNullOrEmpty(userEmail))
                    {
                        // 2. Förbered HTML-mailet med Show-Time design
                        string subject = "Din bokningsbekräftelse - Show-Time";
                        string bodyHtml = $@"
                                <div style='font-family: sans-serif; background-color: #121212; color: white; padding: 30px; border-radius: 10px;'>
                                    <h1 style='color: #e50914; border-bottom: 2px solid #e50914; padding-bottom: 10px;'>Show-Time Malmö</h1>
                                    <h2 style='color: #ffcc00;'>Tack för din bokning!</h2>
                                    <p>Vi har nu tagit emot din bokning. Du hittar alla detaljer och din biljett under <strong>'Min sida'</strong> på webbplatsen.</p>
                                    <div style='background: #1a1a1a; padding: 20px; border: 1px dashed #444; margin-top: 20px;'>
                                        <p style='margin: 0;'>Vi ser fram emot att träffa dig i biosalongen!</p>
                                    </div>
                                    <p style='font-size: 12px; color: #888; margin-top: 30px;'>Detta är ett automatiskt meddelande från Show-Time Biograf.</p>
                                </div>";

                        // 3. Anropa EmailService
                        EmailService.SendEmail(userEmail, subject, bodyHtml);
                    }
                }
                catch (Exception ex)
                {
                    Console.WriteLine("Kunde inte skicka mail: " + ex.Message);
                }
            }
            return RestResult.Parse(context, result);
        });

        // PUT-route för att uppdatera befintlig data (t.ex. ändra profil)
        App.MapPut("/api/{table}/{id}", (
            HttpContext context, string table, string id, JsonElement bodyJson
        ) =>
        {
            var body = JSON.Parse(bodyJson.ToString());
            body.id = id;
            var parsed = ReqBodyParse(table, body);
            var update = parsed.update;
            var sql = $"UPDATE {table} SET {update} WHERE id = @id";
            var result = SQLQueryOne(sql, parsed.body, context);

            // Session-sync när det är just User som ändras.
            if (table == "User") 
            {
                // Servern tittar i sessionen och försöker hämta objektet "user".
                var sessionUser = Session.Get(context, "user");

                // Om någon är inloggad och uppdaterar sin egen user
                // Id jämförs försöker uppdatera samma som den inloggade användarens id
                // tex user 11 inte ska uppdatera till user 12, du får bara synka sessionen om du ändrade din egen profil 
                if (sessionUser != null && (string)id == sessionUser.id.ToString())
                {
                    // Hämtar användaren igen från databasen 
                   // Hämtar den senaste versionen av användaren.
                        var freshUser = SQLQueryOne(
                        "SELECT * FROM User WHERE id = @id",
                        new { id = (int)sessionUser.id }
                    );

                    if (freshUser != null)
                    {
                        //För att lösenord inte ska läggas i session
                        //Den plockar bort känslig data innan vi skickar/sparar user objekt
                        if (freshUser.HasKey("password")) freshUser.Delete("password");
                        Session.Set(context, "user", freshUser);
                    }
                }
            }

            return RestResult.Parse(context, result);
        });

        App.MapDelete("/api/{table}/{id}", (
             HttpContext context, string table, string id
        ) =>
            RestResult.Parse(context, SQLQueryOne(
                $"DELETE FROM {table} WHERE id = @id",
                new { id = id },
                //ReqBodyParse(table, Obj(new { id })).body,
                context
            ))
        );
    }
}