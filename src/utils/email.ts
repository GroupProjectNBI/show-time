/**rensar emailen som skickas in genom att
 * ta bort mellanslag före/efter
 * gör den till lowercase
 */

export function normalizeEmail(raw: string): string {
  return raw.trim().toLowerCase();
}

/**
 * Enkel emailvalidering
 * För att stoppa långa meningar
 * Kräva ett @
 * Kräva punkt i domänen
 * stoppa whitespace
*/
export function isValidEmail(raw: string): boolean {
  const email = normalizeEmail(raw);


  //maxlängd enligt standard
  if (email.length < 5 || email.length > 254) {
    return false;
  }

  //stoppa whitespace
  if (/\s/.test(email)) {
    return false;
  }

  // standard email-format | minst en bokstav före @, måste finnas ett @, minst en bokstav efter @, måste finnas en punkt, minst två tecken efter punkten
  //subdomäner funkar inte ännu
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email);
}


/**
 * Returnerar den HTML-design som ska användas för bekräftelsemailet
 */
export function getBookingEmailHtml(data: { movieTitle: string, seats: string, bookingId: string, date: string }): string {
  return `
    <div style="background-color: #1a1a1a; color: white; padding: 20px; font-family: sans-serif; border-radius: 10px;">
      <h1 style="color: #e50914;">Show-Time</h1>
      <p>Tack för din bokning av <strong>${data.movieTitle}</strong>!</p>
      <hr style="border: 0; border-top: 1px dashed #444;">
      <p><strong>Platser:</strong> ${data.seats}</p>
      <p><strong>Datum:</strong> ${data.date}</p>
      <p style="font-size: 1.2em; color: gold;">Bokningsnummer: ${data.bookingId}</p>
    </div>
  `;
}
