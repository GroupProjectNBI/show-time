namespace WebApp;

using Microsoft.AspNetCore.Builder;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.AspNetCore.HttpOverrides; // Krävs för Traefik/Proxy 

public static class Server
{
    public static void Start()
    {
        // 1. Initiera builder (askr)
        var builder = WebApplication.CreateBuilder();

        // 2. Konfigurera källor för inställningar 
        // Denna kedja för att om där finns miljövariabler så vinner de över db-config filen
        builder.Configuration.AddJsonFile("db-config.json", optional: true, reloadOnChange: true).AddEnvironmentVariables();

        //3. Inställning för Proxy (traefik)
        // Denna kedja gör att SignalR förstår att den körs över HTTPPS via en proxy 
        builder.Services.Configure<ForwardedHeadersOptions>(options =>
        {
            options.ForwardedHeaders = ForwardedHeaders.XForwardedFor | ForwardedHeaders.XForwardedProto;
            options.KnownIPNetworks.Clear();
            options.KnownProxies.Clear();
        });


        builder.Services.AddSignalR();
        App = builder.Build();

        // 4. Aktivera forwarded headers
        // Denna mplste ligga tidigt i pipelinen
        App.UseForwardedHeaders();
        Middleware();
        DebugLog.Start();
        Acl.Start();
        ErrorHandler.Start();
        FileServer.Start();
        AiChatRoutes.Start();
        LoginRoutes.Start();
        RestApi.Start();
        Session.Start();

        App.MapHub<SeatHub>("/api/seathub");

        // 5. Hantera URL för Docker vs Lokalt
        // I Docker (Linux) kan vi inte binda "Localhost", vi måste binda till 0.0.0.0"
        // Vi kollar om en miljövariabel finns, annars kör vi den vanliga localhost
        var isDocker = Environment.GetEnvironmentVariable("DOTNET_RUNNING_IN_CONTAINER") == "true";
        var host = isDocker ? "*" : "localhost";
        var runUrl = $"http://{host}:" + Globals.port;



        // // Start the server on port 3001
        // var runUrl = "http://localhost:" + Globals.port;
        Log("Server running on:", runUrl);
        Log("With these settings:", Globals);
        App.Run(runUrl);

    }

    // Middleware that changes the server response header,
    // initiates the debug logging for the request,
    // keep sessions alive, stops the route if not acl approved
    // and adds some info for debugging
    public static void Middleware()
    {
        App.Use(async (context, next) =>
        {
            // --- NYTT: SLÄPP FÖRBI SIGNALR HELT ---
            // Om trafiken går till stols-hubben, skippa vår vanliga loggning!
            if (context.Request.Path.StartsWithSegments("/api/seathub"))
            {
                await next(context);
                return; // Hoppa ur funktionen här så DebugLog aldrig körs!
            }
            // --------------------------------------

            // Er befintliga kod fortsätter här nedanför...
            context.Response.Headers.Append("Server", (string)Globals.serverName);
            DebugLog.Register(context);
            Session.Touch(context);

            if (!Acl.Allow(context))
            {
                // Acl says the route is not allowed
                context.Response.StatusCode = 405;
                var error = new { error = "Not allowed." };
                DebugLog.Add(context, error);
                await context.Response.WriteAsJsonAsync(error);
            }
            else { await next(context); }

            // Add some extra info for debugging
            var res = context.Response;
            var contentLength = res.ContentLength;
            contentLength = contentLength == null ? 0 : contentLength;
            var info = Obj(new
            {
                statusCode = res.StatusCode,
                contentType = res.ContentType,
                contentLengthKB = Math.Round((double)contentLength / 10.24) / 100,
                RESPONSE_DONE = Now
            });
            if (info.contentLengthKB == null || info.contentLengthKB == 0)
            {
                info.Delete("contentLengthKB");
            }
            DebugLog.Add(context, info);
        });
    }
}