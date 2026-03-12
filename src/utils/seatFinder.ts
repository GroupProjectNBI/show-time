export function findBestSeats(
    ticketCount: number,
    seatsPerRow: number[],
    baseIdOffset: number,
    unavailableSeats: number[],
    anchorSeatId?: number // <--- Vi tar emot senast klickade stol
): number[] {
    if (ticketCount === 0) return [];

    // --- STEG 1: Om vi har en ankarstol, leta på den raden först ---
    if (anchorSeatId) {
        const adjacentGroup = findAdjacentOnSameRow(
            anchorSeatId,
            ticketCount,
            seatsPerRow,
            baseIdOffset,
            unavailableSeats
        );
        if (adjacentGroup.length === ticketCount) return adjacentGroup;
    }

    // --- STEG 2: Om ingen ankarstol finns, eller om raden var full ---
    // Kör den vanliga "Sweet Spot"-logiken (din befintliga kod)
    return searchGlobalBest(ticketCount, seatsPerRow, baseIdOffset, unavailableSeats);
}

function findAdjacentOnSameRow(
    anchorId: number,
    count: number,
    seatsPerRow: number[],
    offset: number,
    unavailable: number[]
): number[] {
    // 1. Hitta exakt vilka ID-gränser denna rad har
    let rowStartId = offset + 1;
    let rowEndId = 0;

    for (const rowSize of seatsPerRow) {
        rowEndId = rowStartId + rowSize - 1;
        if (anchorId >= rowStartId && anchorId <= rowEndId) break;
        rowStartId += rowSize;
    }

    // 2. Prova olika "fönster" runt ankarstolen
    // Vi provar att sätta ankaren som första stol, sen som andra, osv.
    // Detta gör att vi automatiskt "vänder" om det är stopp åt ena hållet.
    for (let offsetInGroup = 0; offsetInGroup < count; offsetInGroup++) {
        const potentialGroup: number[] = [];
        let isPossible = true;
        const startId = anchorId - offsetInGroup;

        for (let i = 0; i < count; i++) {
            const currentId = startId + i;
            // KOLL: Är vi utanför radens gränser? Eller är stolen upptagen?
            if (currentId < rowStartId || currentId > rowEndId || unavailable.includes(currentId)) {
                isPossible = false;
                break;
            }
            potentialGroup.push(currentId);
        }

        if (isPossible) return potentialGroup;
    }

    return []; // Hittade inget på denna rad
}

// Din befintliga logik (flyttad till en egen sub-funktion för renhet)
function searchGlobalBest(ticketCount: number, seatsPerRow: number[], baseIdOffset: number, unavailableSeats: number[]): number[] {
    let bestGroup: number[] = [];
    let bestScore = Infinity;
    const totalRows = seatsPerRow.length;
    const idealRow = Math.floor(totalRows * 0.6);
    let currentSeatId = baseIdOffset + 1;

    for (let rowIndex = 0; rowIndex < totalRows; rowIndex++) {
        const seatsInThisRow = seatsPerRow[rowIndex];
        const idealCol = seatsInThisRow / 2;

        if (seatsInThisRow >= ticketCount) {
            for (let colIndex = 0; colIndex <= seatsInThisRow - ticketCount; colIndex++) {
                const currentGroupIds: number[] = [];
                let isGroupAvailable = true;

                for (let i = 0; i < ticketCount; i++) {
                    const seatId = currentSeatId + colIndex + i;
                    if (unavailableSeats.includes(seatId)) {
                        isGroupAvailable = false;
                        break;
                    }
                    currentGroupIds.push(seatId);
                }

                if (isGroupAvailable) {
                    const rowDistance = Math.abs(rowIndex - idealRow) * 2;
                    const centerOfOurGroup = colIndex + (ticketCount / 2);
                    const colDistance = Math.abs(centerOfOurGroup - idealCol);
                    const totalScore = rowDistance + colDistance;

                    if (totalScore < bestScore) {
                        bestScore = totalScore;
                        bestGroup = currentGroupIds;
                    }
                }
            }
        }
        currentSeatId += seatsInThisRow;
    }
    return bestGroup;
}