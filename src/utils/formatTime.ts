// ==========================================
// 1. FORMAT TIME (Denna fixar ditt bugg-problem)
// ==========================================
export function formatTime(dateInput: string | Date | null | undefined): string {
    if (!dateInput) return "";

    // Om det redan är en sträng (t.ex. "18:00:00" från SQL)
    if (typeof dateInput === 'string') {
        // Om strängen INTE innehåller datum-tecken (T eller -), då är det bara en tid.
        // Då klipper vi bara ut de första 5 tecknen (HH:MM) och skickar tillbaka direkt.
        if (!dateInput.includes('T') && !dateInput.includes('-')) {
            return dateInput.substring(0, 5);
        }
    }

    // Annars: Försök göra om det till ett datum-objekt
    const date = new Date(dateInput);

    // Säkerhetskoll: Om datumet är ogiltigt, returnera tomt eller strängen som den är
    if (isNaN(date.getTime())) {
        return typeof dateInput === 'string' ? dateInput.substring(0, 5) : "";
    }

    // Returnera snygg svensk tid (24h)
    return date.toLocaleTimeString('sv-SE', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: false
    });
}

// ==========================================
// 2. FORMAT DATE (Uppfräschad för konsekvens)
// ==========================================
export function formatDate(dateInput: string | Date | null | undefined): string {
    if (!dateInput) return "";

    const date = new Date(dateInput);

    // Säkerhetskoll
    if (isNaN(date.getTime())) return "";

    // Använder inbyggd svensk formatering (ger automatiskt YYYY-MM-DD)
    return date.toLocaleDateString('sv-SE');
}