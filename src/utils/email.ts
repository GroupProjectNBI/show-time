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

