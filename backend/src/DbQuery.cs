static DbQuery()
{
    try
    {
        // 1. Kolla om vi har en färdig connection string från miljövariabler (Docker-vägen)
        var envConn = Environment.GetEnvironmentVariable("CONNECTION_STRING");

        if (!string.IsNullOrEmpty(envConn))
        {
            // Vi lägger till pooling-inställningar även här för säkerhets skull om de saknas i ENV
            connectionString = envConn.Contains("Pooling") ? envConn : envConn + ";Pooling=true;MinPoolSize=1;MaxPoolSize=100;ConnectionTimeout=30;";

            using var db = new MySqlConnection(connectionString);
            db.Open();
            CreateTablesIfNotExist(db);
            SeedDataIfEmpty(db);
            db.Close();
        }
        else
        {
            // 2. Fallback: Lokal-vägen (JSON-fil)
            var configPath = "db-config.json";

            // Om filen inte finns direkt, testa debug-sökvägen
            if (!File.Exists(configPath))
            {
                configPath = Path.Combine(AppContext.BaseDirectory, "..", "..", "..", "db-config.json");
            }

            if (File.Exists(configPath))
            {
                var configJson = File.ReadAllText(configPath);
                var config = JSON.Parse(configJson);

                // Robust connection string med Pooling!
                connectionString = $"Server={config.host};Port={config.port};Database={config.database};" +
                                   $"User={config.username};Password={config.password};" +
                                   "Pooling=true;MinPoolSize=1;MaxPoolSize=100;ConnectionTimeout=30;";

                using var db = new MySqlConnection(connectionString);
                db.Open();
                if (config.createTablesIfNotExist == true) { CreateTablesIfNotExist(db); }
                if (config.seedDataIfEmpty == true) { SeedDataIfEmpty(db); }
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
        // Logga felet men krascha inte hela backend!
        Console.WriteLine("!!! DATABASE INIT ERROR: " + ex.Message);
    }
}