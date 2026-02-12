import { useState } from "react";

interface ChairsProps {
    numberOfSeats: number;     // Antal stolar på denna rad
    previousSeatsCount: number; // Summan av stolar i tidigare rader
    rowId: number;              // Index för raden (0-baserat)
}

export default function Chairs({ numberOfSeats, previousSeatsCount, rowId }: ChairsProps) {
    // Skapar en array för att kunna mappa ut rätt antal stolar
    const seats = [...Array(numberOfSeats)];

    // Lokal state för att testa klick-logik innan Context kopplas på
    const [selectedInRow, setSelectedInRow] = useState<number[]>([]);

    // Simulerar upptagna stolar för att testa designen (t.ex. var 7:e stol)
    const isOccupied = (id: number) => id % 7 === 0;

    const toggleSeat = (id: number) => {
        // Om stolen är upptagen ska inget hända
        if (isOccupied(id)) return;

        // Lägg till eller ta bort stolen från valda-listan
        setSelectedInRow(prev =>
            prev.includes(id) ? prev.filter(s => s !== id) : [...prev, id]
        );
    };

    return (
        /* flex-row-reverse ser till att stol 1 hamnar längst till höger enligt kravet */
        <div className="flex flex-row-reverse justify-center gap-1 mb-1 w-full">
            {seats.map((_, index) => {
                // Beräkna det löpande numret (1 till 100+)
                // Eftersom vi kör reverse, kommer index 0 vara längst till höger
                const displayId = previousSeatsCount + index + 1;

                const occupied = isOccupied(displayId);
                const selected = selectedInRow.includes(displayId);

                return (
                    <button
                        key={displayId}
                        onClick={() => toggleSeat(displayId)}
                        disabled={occupied}
                        className={`
              relative w-6 h-6 sm:w-8 sm:h-8 rounded-sm 
              flex items-center justify-center 
              text-[10px] font-bold transition-all duration-200
              
              /* Färg-logik baserad på dina Tailwind-variabler */
              ${selected
                                ? 'bg-green-600 text-white scale-110 z-10 shadow-md' // Vald stol
                                : 'bg-accent text-slate-900 hover:brightness-110'    // Standard (guld-beige)
                            }
              
              /* Stil för upptagen stol */
              ${occupied ? 'cursor-not-allowed opacity-80' : 'cursor-pointer'}
            `}
                        title={`Stol ${displayId}`}
                    >
                        {/* Visa numret mitt på stolen */}
                        {displayId}

                        {/* En enkel diagonal röd linje över upptagna stolar */}
                        {occupied && (
                            <span className="absolute inset-0 flex items-center justify-center pointer-events-none overflow-hidden">
                                {/* En enkel linje med primary-färg */}
                                <span className="w-[140%] h-[2px] bg-primary rotate-45 absolute shadow-sm"></span>
                            </span>
                        )}
                    </button>
                );
            })}
        </div>
    );
}