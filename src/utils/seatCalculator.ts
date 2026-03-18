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

/**
 * calculateSeat kan nu anropas på två sätt:
 * 1. (id, "Stora", [8,9...]) -> Använder namnet för offset, och arrayen för layout.
 * 2. (id, [8,9...], 0)      -> Använder arrayen direkt med en manuell offset.
 */
export function calculateSeat(
    seatId: number,
    theaterNameOrLayout: string | number[],
    layoutOrOffset?: number[] | number
) {
    let seatsPerRow: number[] = [];
    let baseOffset = 0;

    // SCENARIO A: Andra argumentet är ett namn ("Stora" / "Lilla")
    if (typeof theaterNameOrLayout === "string") {
        const config = FALLBACK_CONFIG[theaterNameOrLayout] || FALLBACK_CONFIG["Stora"];
        baseOffset = config.baseOffset;

        // Om tredje argumentet är en array, använd den. Annars använd fallback.
        if (Array.isArray(layoutOrOffset)) {
            seatsPerRow = layoutOrOffset;
        } else {
            seatsPerRow = config.seatsPerRow;
        }
    }
    // SCENARIO B: Andra argumentet är en array direkt [8,9,10...]
    else {
        seatsPerRow = theaterNameOrLayout;
        // Om tredje argumentet är ett nummer, använd det som offset.
        baseOffset = typeof layoutOrOffset === "number" ? layoutOrOffset : 0;
    }

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
        .sort((a, b) => a - b)
        // Nu matchar detta calculateSeat perfekt!
        .map(id => calculateSeat(id, theaterName, dbSeatsPerRow).label)
        .join("; ");
}