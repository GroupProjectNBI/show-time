namespace WebApp;

using MySql.Data.MySqlClient;
public static class DbQuery
{
    // Setup the database connection from config
    private static string connectionString;

    // JSON columns for _CONTAINS_ validation (Lägg till 'seats' här om du sparar JSON i DB)
    public static Arr JsonColumns = Arr(new[] { "categories", "seats", "data" });

    public static bool IsJsonColumn(string column) => JsonColumns.Includes(column);

    static DbQuery()
    {
        try
        {
            // 1. Kolla om vi har en färdig connection string från miljövariabler (Docker-vägen)
            var envConn = Environment.GetEnvironmentVariable("CONNECTION_STRING");

            if (!string.IsNullOrEmpty(envConn))
            {
                connectionString = envConn.Contains("Pooling") ? envConn : envConn + ";Pooling=true;MinPoolSize=1;MaxPoolSize=100;ConnectionTimeout=30;";

                using var db = new MySqlConnection(connectionString);
                db.Open();
                RunSetupSql(db); // Kör setup.sql istället för hårdkodad C#
                db.Close();
            }
            else
            {
                // 2. Fallback: Lokal-vägen (JSON-fil)
                var configPath = "db-config.json";

                if (!File.Exists(configPath))
                {
                    configPath = Path.Combine(AppContext.BaseDirectory, "..", "..", "..", "db-config.json");
                }

                if (File.Exists(configPath))
                {
                    var configJson = File.ReadAllText(configPath);
                    var config = JSON.Parse(configJson);

                    connectionString = $"Server={config.host};Port={config.port};Database={config.database};" +
                                       $"User={config.username};Password={config.password};" +
                                       "Pooling=true;MinPoolSize=1;MaxPoolSize=100;ConnectionTimeout=30;";

                    using var db = new MySqlConnection(connectionString);
                    db.Open();

                    // Om inställningen finns i JSON, kör setup-filen
                    if (config.createTablesIfNotExist == true || config.seedDataIfEmpty == true)
                    {
                        RunSetupSql(db);
                    }

                    db.Close();
                }
                else
                {
                    Console.WriteLine("CRITICAL ERROR: No database configuration found (ENV or JSON).");
                }
            }
        }
        catch (Exception ex)
        {
            Console.WriteLine("!!! DATABASE INIT ERROR: " + ex.Message);
        }
    }

    private static void RunSetupSql(MySqlConnection db)
    {
        try
        {
            var sqlPath = "setup.sql";
            if (!File.Exists(sqlPath))
            {
                sqlPath = Path.Combine(AppContext.BaseDirectory, "..", "..", "..", "setup.sql");
            }

            if (File.Exists(sqlPath))
            {
                Console.WriteLine($">>> Database Initialization: Running {sqlPath}");
                var setupSql = File.ReadAllText(sqlPath);

                // FIX: Använd MySqlScript istället för att splitta med .Split(';')
                // Detta hanterar DELIMITER och Procedures automatiskt.
                var script = new MySqlScript(db, setupSql);
                script.Execute();

                Console.WriteLine(">>> Database setup and seeding complete!");
            }
        }
        catch (Exception ex)
        {
            Console.WriteLine("!!! Error running setup.sql: " + ex.Message);
        }
    }
    // --- HJÄLPFUNKTIONER FÖR SQL ---

    private static dynamic ObjFromReader(MySqlDataReader reader)
    {
        var obj = Obj();
        for (var i = 0; i < reader.FieldCount; i++)
        {
            var key = reader.GetName(i);
            var value = reader.GetValue(i);

            if (value == DBNull.Value)
            {
                obj[key] = null;
            }
            else if (value is DateTime dt)
            {
                obj[key] = dt.ToString("yyyy-MM-ddTHH:mm:ss");
            }
            else if (value is sbyte sb)
            {
                obj[key] = sb != 0;
            }
            else if (value is bool b)
            {
                obj[key] = b;
            }
            else if (value is string strValue && (strValue.StartsWith("[") || strValue.StartsWith("{")))
            {
                if (key == "data")
                {
                    obj[key] = strValue;
                }
                else
                {
                    try { obj[key] = JSON.Parse(strValue); }
                    catch { obj[key] = strValue.TryToNum(); }
                }
            }
            else
            {
                obj[key] = value.ToString().TryToNum();
            }
        }
        return obj;
    }

    public static Arr SQLQuery(string sql, object parameters = null, HttpContext context = null)
    {
        var paras = parameters == null ? Obj() : Obj(parameters);
        using var db = new MySqlConnection(connectionString);
        var rows = Arr();

        try
        {
            db.Open();
            var command = db.CreateCommand();
            command.CommandText = @sql;
            var entries = (Arr)paras.GetEntries();
            entries.ForEach(x => command.Parameters.AddWithValue("@" + x[0], x[1]));

            if (sql.TrimStart().StartsWith("SELECT ", StringComparison.OrdinalIgnoreCase))
            {
                using var reader = command.ExecuteReader();
                while (reader.Read()) rows.Push(ObjFromReader(reader));
            }
            else
            {
                rows.Push(new
                {
                    command = sql.Trim().Split(" ")[0].ToUpper(),
                    rowsAffected = command.ExecuteNonQuery()
                });
            }
        }
        catch (Exception err)
        {
            Console.WriteLine("SQL ERROR: " + err.Message);
            rows.Push(new { error = err.Message });
        }
        return rows;
    }

    public static dynamic SQLQueryOne(string sql, object parameters = null, HttpContext context = null)
    {
        return SQLQuery(sql, parameters, context)[0];
    }
}