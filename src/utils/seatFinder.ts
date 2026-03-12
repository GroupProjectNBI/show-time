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
    let rowStartId = offset + 1;
    let rowEndId = 0;

    for (const rowSize of seatsPerRow) {
        rowEndId = rowStartId + rowSize - 1;
        if (anchorId >= rowStartId && anchorId <= rowEndId) break;
        rowStartId += rowSize;
    }

    // --- NY PRIORITERING: Centrera runt ankaren ---
    // Vi skapar en lista på "start-offsets" som vi vill prova i ordning.
    // Om vi vill ha 3 stolar, vill vi helst att ankaren är i mitten (index 1 i gruppen).
    const middleIndex = Math.floor((count - 1) / 2);

    const searchOffsets = [];
    // 1. Prova perfekt centrerat
    searchOffsets.push(middleIndex);

    // 2. Fyll på med resten av möjligheterna (närmast mitten först)
    for (let i = 0; i < count; i++) {
        if (i !== middleIndex) searchOffsets.push(i);
    }
    // searchOffsets blir t.ex. [1, 0, 2] för 3 biljetter. 
    // Den provar index 1 (centrerat) först, sen index 0, sen index 2.

    for (const offsetInGroup of searchOffsets) {
        const potentialGroup: number[] = [];
        let isPossible = true;
        const startId = anchorId - offsetInGroup;

        for (let i = 0; i < count; i++) {
            const currentId = startId + i;
            if (currentId < rowStartId || currentId > rowEndId || unavailable.includes(currentId)) {
                isPossible = false;
                break;
            }
            potentialGroup.push(currentId);
        }

        if (isPossible) return potentialGroup;
    }

    return [];
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