// Vi sparar layouterna här centralt så slipper du skicka med dem varje gång
const THEATER_CONFIG: Record<string, number[]> = {
    "Stora": [8, 9, 10, 10, 10, 10, 11, 12],
    "Lilla": [10, 10, 10, 10, 10]
};

/**
 * FUNKTION 1: För BookingPage (Hanterar en enskild siffra)
 * Returnerar ett objekt så du kan använda siffrorna var för sig om du vill.
 * **
 * Hjälpfunktion som automatiskt räknar ut Rad och Stol.
 * Den känner av salongen själv: 1 - 80(Stora), 81 - 130(Lilla)
    */


export function calculateSeat(seatId: number) {
    // 1. Identifiera salong baserat på ID
    // Stora Salongen (1-80), Lilla Salongen (81-130)
    const isLilla = seatId > 80;

    // Sätt offset och rader baserat på vilken salong det är
    const offset = isLilla ? 80 : 0;
    const rows = isLilla
        ? [10, 10, 10, 10, 10] // Lilla: 5 rader med 10 stolar
        : [8, 9, 10, 10, 10, 10, 11, 12]; // Stora: 8 rader med varierat antal

    // 2. Räkna ut lokalt ID inom salongen
    const localId = seatId - offset;

    let currentCount = 0;

    // 3. Loopa igenom raderna för att hitta rätt position
    for (let i = 0; i < rows.length; i++) {
        const seatsInThisRow = rows[i];
        const rowLimit = currentCount + seatsInThisRow;

        if (localId <= rowLimit) {
            const rowNum = i + 1;
            const seatNum = localId - currentCount;

            return {
                row: rowNum,
                seat: seatNum,
                label: `Rad ${rowNum}, Stol ${seatNum}`,
                shortLabel: `Rad ${rowNum}, Stol ${seatNum}`
            };
        }
        currentCount = rowLimit;
    }

    // Fallback om något ID hamnar utanför våra rader
    return {
        row: 0,
        seat: 0,
        label: `Stol ${seatId}`,
        shortLabel: `Stol ${seatId}`
    };
}

/**
 * FUNKTION 2: 
 * Hanterar både strängar "109, 110", Arrayer [109, 110] och enskilda siffror 109.
 * Hjälpfunktion för att formatera strängar från databasen (t.ex. "81, 82")
*/

export function formatSeatString(seatInput: any): string {
    if (!seatInput) return "Information saknas";

    let seatIds: number[] = [];

    if (Array.isArray(seatInput)) {
        seatIds = seatInput.map(id => Number(id));
    } else if (typeof seatInput === "string") {
        seatIds = seatInput.split(",").map(id => parseInt(id.trim()));
    } else if (typeof seatInput === "number") {
        seatIds = [seatInput];
    }

    // Vi använder calculateSeat här inne också!
    return seatIds
        .map(id => calculateSeat(id).label) // Vi använder .label för "Rad X, Stol Y"
        .join("; ");
}