namespace WebApp;

public static class RestApi
{
    public static void Start()
    {
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

        App.MapPost("/api/{table}", (
            HttpContext context, string table, JsonElement bodyJson
        ) =>
        {
            var body = JSON.Parse(bodyJson.ToString());

            string email = "";
            if (bodyJson.TryGetProperty("email", out var emailElement) && emailElement.ValueKind != JsonValueKind.Null)
            {
                email = emailElement.GetString();
                Console.WriteLine($"💡 Fångade upp email: {email}");
            }

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

            if (!result.HasKey("error"))
            {
                result.insertId = SQLQueryOne(
                    @$"SELECT id AS __insertId 
               FROM {table} ORDER BY id DESC LIMIT 1"
                ).__insertId;

                if (table == "Booking")
                {
                    Console.WriteLine("--- Försöker skicka bokningsmail ---");

                    var sessionUser = Session.Get(context, "user");
                    string userEmail = sessionUser?.email ?? email;

                    Console.WriteLine("Mottagare för bokningsmail: " + (userEmail ?? "INGEN EMAIL HITTAD"));

                    if (!string.IsNullOrEmpty(userEmail))
                    {
                        try
                        {
                            string bookingRef = body?.bookingRef;

                            var frontendBaseUrl =
                                Environment.GetEnvironmentVariable("FRONTEND_BASE_URL")
                                ?? "http://localhost:5173";

                            string cancelLink = !string.IsNullOrWhiteSpace(bookingRef)
                                ? $"{frontendBaseUrl}/cancel-booking?bookingRef={bookingRef}"
                                : "";

                            string subject = "Din bokningsbekräftelse - Show-Time";
                            string bodyHtml = $@"
                        <div style='font-family: sans-serif; background-color: #121212; color: white; padding: 30px; border-radius: 10px;'>
                            <h1 style='color: #e50914; border-bottom: 2px solid #e50914; padding-bottom: 10px;'>Show-Time Malmö</h1>
                            <h2 style='color: #ffcc00;'>Tack för din bokning!</h2>
                            <p>Vi har nu tagit emot din bokning. Du hittar alla detaljer och din biljett under <strong>'Min sida'</strong> på webbplatsen.</p>
                            {(string.IsNullOrEmpty(cancelLink)
                                ? ""
                                : $@"<p style='margin-top: 18px;'>
                                        Vill du avboka? Klicka här:
                                        <a style='color:#ffcc00;' href='{cancelLink}'>Avboka bokning</a>
                                     </p>")}
                            <div style='background: #1a1a1a; padding: 20px; border: 1px dashed #444; margin-top: 20px;'>
                                <p style='margin: 0;'>Vi ser fram emot att träffa dig i biosalongen!</p>
                            </div>
                            <p style='font-size: 12px; color: #888; margin-top: 30px;'>Detta är ett automatiskt meddelande från Show-Time Biograf.</p>
                        </div>";

                            EmailService.SendEmail(userEmail, subject, bodyHtml);
                            Console.WriteLine($"[Booking] Bekräftelse skickad till {userEmail}");
                        }
                        catch (Exception ex)
                        {
                            Console.WriteLine("Kunde inte skicka mail: " + ex.Message);
                        }
                    }
                }

                if (table == "Screening")
                {
                    try
                    {
                        var sessionUser = Session.Get(context, "user");
                        string adminEmail = sessionUser?.email;

                        if (!string.IsNullOrEmpty(adminEmail))
                        {
                            string subject = "Ny visning skapad - Show-Time Admin";
                            string bodyHtml = $@"
                    <div style='font-family: sans-serif; border: 2px solid #ffcc00; padding: 20px;'>
                        <h1 style='color: #ffcc00;'>Systemmeddelande</h1>
                        <p>En ny visning (Screening) har lagts till i systemet.</p>
                        <p>Kontrollera visningsschemat för att säkerställa att allt ser korrekt ut.</p>
                    </div>";

                            EmailService.SendEmail(adminEmail, subject, bodyHtml);
                            Console.WriteLine("[Screening] Admin-notis skickad.");
                        }
                    }
                    catch (Exception ex) { Console.WriteLine("Mail-fel (Screening): " + ex.Message); }
                }
            }

            return RestResult.Parse(context, result);
        });

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

            if (table == "User")
            {
                var sessionUser = Session.Get(context, "user");

                if (sessionUser != null && (string)id == sessionUser.id.ToString())
                {
                    var freshUser = SQLQueryOne(
                        "SELECT * FROM User WHERE id = @id",
                        new { id = (int)sessionUser.id }
                    );

                    if (freshUser != null)
                    {
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
                context
            ))
        );
    }
}