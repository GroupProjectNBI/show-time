// Din fallback-konfiguration (Säkerhetsnätet)
const FALLBACK_CONFIG: Record<string, { seatsPerRow: number[], baseOffset: number }> = {
    "Stora": {
        seatsPerRow: [8, 9, 10, 10, 10, 10, 11, 12],
        baseOffset: 0
    },
    "Lilla": {
        seatsPerRow: [10, 10, 10, 10, 10],
        baseOffset: 81
    }
};

export function calculateSeat(
    seatId: number,
    theaterName: string,
    dbSeatsPerRow?: number[] // Valfri: Om vi har data från databasen använder vi den
) {
    // 1. Välj layout: Använd db-data om den finns, annars fallback
    const fallback = FALLBACK_CONFIG[theaterName] || FALLBACK_CONFIG["Stora"];
    const seatsPerRow = dbSeatsPerRow || fallback.seatsPerRow;
    const baseOffset = fallback.baseOffset;

    const localId = seatId - baseOffset;
    let currentCount = 0;

    for (let i = 0; i < seatsPerRow.length; i++) {
        const seatsInRow = seatsPerRow[i];
        const rowLimit = currentCount + seatsInRow;

        if (localId <= rowLimit) {
            const rowNum = i + 1;
            const seatNum = localId - currentCount;

            return {
                row: rowNum,
                seat: seatNum,
                label: `Rad ${rowNum}, Stol ${seatNum}`
            };
        }
        currentCount = rowLimit;
    }

    // Sista utvägen om stolen ligger utanför alla rader
    return { row: 0, seat: 0, label: `Stol ${seatId}` };
}

/**
 * Formaterar strängen. Kan anropas med:
 * formatSeatString(ids, "Stora") -> Använder fallback
 * formatSeatString(ids, "Stora", dbArray) -> Använder live-data
 */
export function formatSeatString(
    seatInput: any,
    theaterName: string,
    dbSeatsPerRow?: number[]
): string {
    if (!seatInput) return "Information saknas";

    let seatIds: number[] = [];
    if (Array.isArray(seatInput)) {
        seatIds = seatInput.map(id => Number(id));
    } else if (typeof seatInput === "string") {
        seatIds = seatInput.split(",").map(id => parseInt(id.trim())).filter(id => !isNaN(id));
    } else {
        seatIds = [Number(seatInput)];
    }

    return seatIds
        .map(id => calculateSeat(id, theaterName, dbSeatsPerRow).label)
        .join("; ");
}