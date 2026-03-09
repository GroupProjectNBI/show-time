export function findBestSeats(
    ticketCount: number,
    seatsPerRow: number[],
    baseIdOffset: number,
    unavailableSeats: number[] // Både sålda i DB och låsta i realtid
): number[] {
    // Om vi inte valt några biljetter än, returnera tom array
    if (ticketCount === 0) return [];

    let bestGroup: number[] = [];
    let bestScore = Infinity; // Vi letar efter den LÄGSTA straffpoängen

    const totalRows = seatsPerRow.length;
    // Sweet spot: ca 60% bak i salongen. (t.ex. rad 6 av 10)
    // Vi lägger stort straff på rader långt fram, men mindre straff på rader längre bak.
    const idealRow = Math.floor(totalRows * 0.6);

    let currentSeatId = baseIdOffset + 1; // Start-ID för första stolen (t.ex. 1 eller 82)

    // 1. Gå igenom salongen rad för rad
    for (let rowIndex = 0; rowIndex < totalRows; rowIndex++) {
        const seatsInThisRow = seatsPerRow[rowIndex];

        // Mitten på just den här raden (t.ex. stol 5 och 6 om raden har 10 stolar)
        const idealCol = seatsInThisRow / 2;

        // Har raden ens tillräckligt många stolar för vårt sällskap?
        if (seatsInThisRow >= ticketCount) {

            // 2. Titta på alla möjliga "grupper" av stolar på denna rad
            // Om vi vill ha 3 stolar på en rad med 10, kan vi sitta på plats 0-1-2, 1-2-3, osv.
            for (let colIndex = 0; colIndex <= seatsInThisRow - ticketCount; colIndex++) {

                const currentGroupIds: number[] = [];
                let isGroupAvailable = true;

                // 3. Kolla om alla stolar i just denna grupp är lediga
                for (let i = 0; i < ticketCount; i++) {
                    const seatId = currentSeatId + colIndex + i;

                    if (unavailableSeats.includes(seatId)) {
                        isGroupAvailable = false;
                        break; // Avbryt, någon sitter redan här!
                    }
                    currentGroupIds.push(seatId);
                }

                // 4. Om hela gruppen är ledig, dags att poängsätta den!
                if (isGroupAvailable) {
                    // Avstånd från den perfekta raden. Vi multiplicerar med 2 för att 
                    // straffa "fel rad" hårdare än "lite vid sidan av mitten".
                    const rowDistance = Math.abs(rowIndex - idealRow) * 2;

                    // Avstånd från mitten av raden (vi räknar från mitten av vårt sällskap)
                    const centerOfOurGroup = colIndex + (ticketCount / 2);
                    const colDistance = Math.abs(centerOfOurGroup - idealCol);

                    // Total straffpoäng
                    const totalScore = rowDistance + colDistance;

                    // Är detta den bästa placeringen hittills?
                    if (totalScore < bestScore) {
                        bestScore = totalScore;
                        bestGroup = currentGroupIds;
                    }
                }
            }
        }

        // Räkna upp ID:t så vi hamnar på rätt nummer för nästa rad
        currentSeatId += seatsInThisRow;
    }

    return bestGroup; // Returnerar de absolut bästa, sammanhängande stolarna!
}