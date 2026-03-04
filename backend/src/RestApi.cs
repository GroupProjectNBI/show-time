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
            if (!result.HasKey("error"))
            {
                // Get the insert id and add to our result
                result.insertId = SQLQueryOne(
                    @$"SELECT id AS __insertId 
                       FROM {table} ORDER BY id DESC LIMIT 1"
                ).__insertId;
            }
            return RestResult.Parse(context, result);
        });
        

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

        App.MapGet("/api/{table}/{id}", (
            HttpContext context, string table, string id
        ) =>
            RestResult.Parse(context, SQLQueryOne(
                $"SELECT * FROM {table} WHERE id = @id",
                ReqBodyParse(table, Obj(new { id })).body,
                context
            ))
        );

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
                ReqBodyParse(table, Obj(new { id })).body,
                context
            ))
        );
    }
}