namespace WebApp;

public static class DebugLog
{
    private static readonly Obj memory = new();
    // 1. Skapa lås-objektet
    private static readonly object _lock = new();

    public static void Start()
    {
        Write();
    }

    private static string GetId(HttpContext context)
    {
        return context.Items.TryGetValue("id", out object value) ? value + "" : null;
    }

    public static void Register(HttpContext context)
    {
        if (!Globals.debugOn) { return; }
        var id = Guid.NewGuid().ToString();
        context.Items["id"] = id;

        // 2. Lås när vi skriver till minnet
        lock (_lock)
        {
            memory[id] = new
            {
                time = DateTime.Now.ToString("yyyy-MM-dd HH\\:mm\\:ss"),
                timestamp = Now,
                timeTakenMs = 0,
                route = context.Request.Method + " " + context.Request.Path.Value
            };
        }
    }

    public static void Add(HttpContext context, object info)
    {
        if (!Globals.debugOn) { return; }
        var id = GetId(context);

        // 3. Lås när vi ändrar i minnet
        lock (_lock)
        {
            if (id == null || memory[id] == null) { return; }
            memory[id] = Obj(new { ___ = memory[id], ___2 = info });
        }
    }

    public static async void Write()
    {
        if (!Globals.debugOn) { return; }

        while (true)
        {
            // 4. Lås hela loopen som går igenom nycklarna
            // Vi gör detta för att ingen ska kunna lägga till/ta bort under tiden vi läser
            lock (_lock)
            {
                memory.GetKeys().ForEach(key =>
                {
                    if (key == null) return;
                    var item = memory[key];
                    if (item == null) return;

                    try
                    {
                        if (item.RESPONSE_DONE != null || item.timestamp + 5000 < Now)
                        {
                            if (item.RESPONSE_DONE != null)
                            {
                                item.timeTakenMs = item.RESPONSE_DONE - item.timestamp;
                                item.Delete("RESPONSE_DONE");
                            }
                            else
                            {
                                item.Delete("timeTaken");
                            }

                            Log(item);
                            memory.Delete(key);
                        }
                    }
                    catch (Exception ex)
                    {
                        Console.WriteLine($"[DebugLog Varning] Kunde inte logga rad {key}: {ex.Message}");
                        memory.Delete(key);
                    }
                });
            } // Här släpps låset så att requests kan komma in igen

            await Task.Delay(500);
        }
    }
}