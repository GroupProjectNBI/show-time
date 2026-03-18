namespace WebApp;

public static class AiChatRoutes
{
    private static string aiAccessToken = "";
    private static string systemPrompt = "";
    private static readonly string proxyUrl = "https://ai-api.nodehill.com";
    private static readonly HttpClient httpClient = new HttpClient();

    public static void Start()
    {
        LoadConfig();
        LoadSystemPrompt();

        App.MapPost("/api/chat", async (HttpContext context, JsonElement bodyJson) =>
        {
            try
            {
                var body = JSON.Parse(bodyJson.ToString());
                var messages = (Arr)body.messages;

                if (messages == null || messages.Count() == 0)
                {
                    return RestResult.Parse(context, new { error = "Messages array is required." });
                }

                dynamic lastMsgObj = messages[messages.Count() - 1];
                string lastContent = (lastMsgObj.content ?? "").ToString().ToLower();
                string? filterDate = null;

                if (lastContent.Contains("idag"))
                {
                    filterDate = DateTime.Now.ToString("yyyy-MM-dd");
                }
                else if (lastContent.Contains("imorgon"))
                {
                    filterDate = DateTime.Now.AddDays(1).ToString("yyyy-MM-dd");
                }
                else if (lastContent.Contains("lördag"))
                {
                    int daysUntilSaturday = ((int)DayOfWeek.Saturday - (int)DateTime.Now.DayOfWeek + 7) % 7;
                    if (daysUntilSaturday == 0 && !lastContent.Contains("idag")) daysUntilSaturday = 7;
                    filterDate = DateTime.Now.AddDays(daysUntilSaturday).ToString("yyyy-MM-dd");
                }

                string dynamicContext = GetDynamicMovieContext(filterDate);
                string fullSystemContent = systemPrompt + "\n" + dynamicContext;

                var fullMessages = Arr();
                fullMessages.Push(Obj(new { role = "system", content = fullSystemContent }));
                messages.ForEach(msg => fullMessages.Push(msg));

                var requestBody = Obj(new { messages = fullMessages });
                var request = new HttpRequestMessage(HttpMethod.Post, $"{proxyUrl}/v1/chat/completions");
                request.Headers.Add("Authorization", $"Bearer {aiAccessToken}");
                request.Content = new StringContent(
                    JSON.Stringify(requestBody),
                    System.Text.Encoding.UTF8,
                    "application/json"
                );

                var response = await httpClient.SendAsync(request);
                var responseContent = await response.Content.ReadAsStringAsync();

                if (!response.IsSuccessStatusCode)
                {
                    return RestResult.Parse(context, JSON.Parse(responseContent));
                }

                return RestResult.Parse(context, JSON.Parse(responseContent));
            }
            catch (Exception ex)
            {
                return RestResult.Parse(context, new { error = ex.Message });
            }
        });
    }

    private static string GetDynamicMovieContext(string filterDate = null)
    {
        string sql = "SELECT movieTitle, theaterName, startTime, availableSeats, ageLimit FROM v_screenings WHERE startTime >= NOW()";

        if (!string.IsNullOrEmpty(filterDate))
        {
            sql += $" AND DATE(startTime) = '{filterDate}'";
        }

        sql += " ORDER BY startTime ASC LIMIT 25";

        var screenings = DbQuery.SQLQuery(sql);
        string context = filterDate != null
            ? $"\n### Visningar för datum {filterDate}:\n"
            : "\n### Kommande visningar:\n";

        foreach (var s in screenings)
        {
            DateTime st = DateTime.Parse(s.startTime.ToString());
            string relativeUrl = $"/bokning/{s.id}";
            context += $"- Tid: {st:MM-dd HH:mm} | Film: {s.movieTitle} | Salong: {s.theaterName} | Lediga platser: {s.availableSeats} | Länk: {relativeUrl}\n";
        }

        var culture = new CultureInfo("sv-SE");
        string todaysDate = DateTime.Now.ToString("dddd den d MMMM yyyy 'kl' HH:mm", culture);

        context += $"\nSysteminfo: Idag är det {todaysDate}. VIKTIGT: När du rekommenderar en film måste du ALLTID skapa en klickbar länk till den. Använd formatet [Boka biljetter här](/bokning/ID) baserat på Länk-datan i listan. Inkludera aldrig domännamn eller https://, använd bara den relativa länken.";

        return context;
    }

    private static void LoadConfig()
    {
        try
        {
            // Försök hämta från miljövariabler först
            string token = Environment.GetEnvironmentVariable("aiAccessToken");

            if (!string.IsNullOrEmpty(token))
            {
                aiAccessToken = token;
            }
            else
            {
                // Fallback till json
                var configPath = Path.Combine(AppContext.BaseDirectory, "..", "..", "..", "db-config.json");
                if (!File.Exists(configPath)) configPath = "db-config.json";
                var configJson = File.ReadAllText(configPath);
                var config = JSON.Parse(configJson);

                if (config.aiAccessToken != null)
                {
                    aiAccessToken = (string)config.aiAccessToken;
                }
            }
        }
        catch (Exception ex) { Console.WriteLine("Fel vid laddning av AI-config: " + ex.Message); }
    }

    private static void LoadSystemPrompt()
    {
        try
        {
            // 1. Leta i samma mapp som den kompilerade koden (Docker / Produktion)
            var promptPath = Path.Combine(AppContext.BaseDirectory, "system-prompt.md");

            // 2. Om den inte finns där, hoppa upp tre mappar (Lokal utveckling i VS/VS Code)
            if (!File.Exists(promptPath))
            {
                promptPath = Path.Combine(AppContext.BaseDirectory, "..", "..", "..", "system-prompt.md");
            }

            // Läs in filen om vi hittade den
            if (File.Exists(promptPath))
            {
                systemPrompt = File.ReadAllText(promptPath);
                Console.WriteLine("[AiChatRoutes] System prompt laddad framgångsrikt!");
            }
            else
            {
                Console.WriteLine("[AiChatRoutes] VARNING: Hittade inte system-prompt.md! AI:n kommer tappa sin personlighet.");
            }
        }
        catch (Exception ex) { Console.WriteLine("Error loading system prompt: " + ex.Message); }
    }
}