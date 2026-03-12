// Hjälpfunktion för att hämta inställningar säkert
string GetSetting(int argIndex, string envName, string defaultValue)
{
    // 1. Kolla miljövariabel (viktigast för Docker)
    var envVal = Environment.GetEnvironmentVariable(envName);
    if (!string.IsNullOrEmpty(envVal)) return envVal;

    // 2. Kolla args (för din lokala Node-start)
    if (args.Length > argIndex) return args[argIndex];

    // 3. Standardvärde (för säkerhets skull)
    return defaultValue;
}

// Global settings
Globals = Obj(new
{
    debugOn = true,
    detailedAclDebug = false,
    aclOn = false,
    isSpa = true,
    // Vi hämtar värdena säkert här:
    port = GetSetting(0, "PORT", "3001"),
    serverName = "Show-Time Super Backend",
    frontendPath = GetSetting(1, "FRONTEND_PATH", "wwwroot"),
    sessionLifeTimeHours = 2
});

Server.Start();