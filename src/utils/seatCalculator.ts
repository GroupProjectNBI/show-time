
/**
 * FUNKTION 1: För BookingPage (Hanterar en enskild siffra)
 * Returnerar ett objekt så du kan använda siffrorna var för sig om du vill.
 * **
 * Hjälpfunktion som automatiskt räknar ut Rad och Stol.
 * Den känner av salongen själv: 1 - 80(Stora), 81 - 130(Lilla)
    */

/**
 * Dynamisk seat calculator
 * Fungerar för alla salonger eftersom den använder seatsPerRow från databasen.
 *
 * seatId      = globalt ID (1–80 för Stora, 81–130 för Lilla)
 * seatsPerRow = array från databasen, t.ex. [8,9,10,10,10,10,11,12]
 * baseOffset  = 0 för Stora, 81 för Lilla
 */

export function calculateSeat(
    seatId: number,
    seatsPerRow: number[],
    baseOffset: number = 0
) {
    // Gör seatId lokalt för salongen
    const localId = seatId - baseOffset;

    let currentCount = 0;

    for (let i = 0; i < seatsPerRow.length; i++) {
        const seatsInRow = seatsPerRow[i];
        const rowLimit = currentCount + seatsInRow;

        // Om localId hamnar i denna rad
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

    // Fallback om något är fel
    return {
        row: 0,
        seat: 0,
        label: `Stol ${seatId}`,
        shortLabel: `Stol ${seatId}`
    };
}

/**
 * Formaterar en sträng eller array av seatIds till "Rad X, Stol Y"
 */
export function formatSeatString(
    seatInput: any,
    seatsPerRow: number[],
    baseOffset: number = 0
): string {

    if (!seatInput) return "Information saknas";

    let seatIds: number[] = [];

    if (Array.isArray(seatInput)) {
        seatIds = seatInput.map(id => Number(id));
    } else if (typeof seatInput === "string") {
        seatIds = seatInput.split(",").map(id => parseInt(id.trim()));
    } else if (typeof seatInput === "number") {
        seatIds = [seatInput];
    }

    return seatIds
        .map(id => calculateSeat(id, seatsPerRow, baseOffset).label)
        .join("; ");
}

