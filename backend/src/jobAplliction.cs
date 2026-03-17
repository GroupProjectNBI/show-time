namespace WebApp;

public static class Jobbchangelater
{

  public static void Start()
  {

    App.MapPost("/api/job-application", async (HttpRequest req) =>
 {
   var form = await req.ReadFormAsync();

   string jobId = form["jobId"]!;
   string jobTitle = form["jobTitle"]!;
   string firstName = form["firstName"]!;
   string lastName = form["lastName"]!;
   string email = form["email"]!;
   string pitch = form["pitch"]!;

   var cv = form.Files["cv"];
   var letter = form.Files["letter"];

   // --- SÄKERHETSKOLL BACKEND ---
   long maxFileSize = 5 * 1024 * 1024; // 5MB

   // Skapa en snabb hjälpfunktion för att validera filerna
   bool IsValidPdf(IFormFile? file)
   {
     if (file == null) return true; // Det är okej om filen saknas (om de inte är required backend)
     if (file.Length > maxFileSize) return false;
     if (file.ContentType != "application/pdf") return false;
     if (Path.GetExtension(file.FileName).ToLower() != ".pdf") return false;
     return true;
   }

   // Om någon fil är ogiltig, kasta ut dem direkt!
   if (!IsValidPdf(cv) || !IsValidPdf(letter))
   {
     return Results.BadRequest(new { error = "Ogiltig fil. Endast PDF-filer under 5MB är tillåtna." });
   }
   // -----------------------------

   var attachments = new List<(string FileName, byte[] Data)>();

   if (cv != null)
   {
     using var ms = new MemoryStream();
     await cv.CopyToAsync(ms);
     attachments.Add((cv.FileName, ms.ToArray()));
   }

   if (letter != null)
   {
     using var ms = new MemoryStream();
     await letter.CopyToAsync(ms);
     attachments.Add((letter.FileName, ms.ToArray()));
   }

   string bodyHtml = $@"
   <div style='font-family: sans-serif; background-color: #121212; color: white; padding: 30px; border-radius: 10px;'>
       <h1 style='color: #e50914; border-bottom: 2px solid #e50914; padding-bottom: 10px;'>Show-Time Rekrytering</h1>
       <h2 style='color: #ffcc00;'>Ny ansökan: {jobTitle}</h2>
       
       <div style='background: #1a1a1a; padding: 20px; border: 1px dashed #444; margin-top: 20px;'>
           <h3 style='margin-top: 0; color: #fff;'>Information om sökande</h3>
           <p><strong>Namn:</strong> {firstName} {lastName}</p>
           <p><strong>Email:</strong> {email}</p>
       </div>

       <h3 style='color: #ffcc00; margin-top: 20px;'>Pitch</h3>
       <p style='background: #1a1a1a; padding: 15px; border-left: 4px solid #e50914; line-height: 1.5;'>{pitch}</p>

       <p style='margin-top: 20px;'><em>CV och personligt brev finns bifogat i detta mail.</em></p>
       <p style='font-size: 12px; color: #888; margin-top: 30px;'>Detta är ett automatiskt systemmeddelande från Show-Time webbplats.</p>
   </div>";

   // --- Anropa EmailService (utan 'to' så den går till företagets mail!) ---
   EmailService.SendEmailWithAttachments(
       subject: $"Ny ansökan – {jobTitle} ({firstName} {lastName})",
       body: bodyHtml,
       attachments: attachments
   );

   Console.WriteLine($"[JobApplication] Ny ansökan mottagen för {jobTitle} från {email}");

   return Results.Ok(new { success = true });
 });

  }

}
