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

  string body = $@"
<h2>Ny jobbansökan</h2>

<p><strong>Tjänst:</strong> {jobTitle}</p>
<p><strong>Jobb-ID:</strong> {jobId}</p>

<h3>Sökande</h3>
<p><strong>Namn:</strong> {firstName} {lastName}</p>
<p><strong>Email:</strong> {email}</p>

<h3>Pitch</h3>
<p>{pitch}</p>

<p>CV och personligt brev finns bifogat.</p>
";

  EmailService.SendEmailWithAttachments(
      to: "jobs@showtime.se",
      subject: $"Ny ansökan – {jobTitle}",
      body: body,
      attachments: attachments
  );

  return Results.Ok(new { success = true });
});


  }

}
