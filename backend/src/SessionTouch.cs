namespace WebApp;

public static partial class Session
{
    // Touch the session - set modified to now!
    public static void Touch(HttpContext context)
    {
        // Vi lägger till en try-catch även här för säkerhets skull
        try
        {
            SQLQuery(
                @"UPDATE sessions SET modified = NOW()
                  WHERE id = @id",
                new { GetRawSession(context).id }
            );
        }
        catch (Exception ex)
        {
            Console.WriteLine($"Session touch failed: {ex.Message}");
        }
    }

    // Delete old sessions
    public static async void DeleteOldSessions()
    {
        var hours = Globals.sessionLifeTimeHours;

        // Denna loop körs för evigt i bakgrunden
        while (true)
        {
            try
            {
                // Försök städa databasen
                SQLQuery(
                    @$"DELETE FROM sessions WHERE 
                        DATE_SUB(NOW(), INTERVAL {hours} HOUR) > modified"
                );
                // Om vi vill logga att det lyckades:
                
            }
            catch (Exception ex)
            {
                // HÄR RÄDDAR VI APPEN! 
                // Om databasen är nere eller upptagen, loggar vi bara felet.
                Console.WriteLine($"[CRITICAL WARNING] Session cleanup failed: {ex.Message}");
                Console.WriteLine("Backend will continue to run and retry in 60 seconds.");
            }

            // Vänta en minut till nästa koll
            await Task.Delay(60000);
        }
    }
}