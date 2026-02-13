import { useState } from "react";

interface ChairsProps {
    numberOfSeats: number;     // Antal stolar på denna rad
    previousSeatsCount: number; // Summan av stolar i tidigare rader
    rowId: number;              // Index för raden (0-baserat)
}

export default function Chairs({ numberOfSeats, previousSeatsCount, rowId }: ChairsProps) {
    const seats = [...Array(numberOfSeats)];
    const [selectedInRow, setSelectedInRow] = useState<number[]>([]);
    const isOccupied = (id: number) => id % 7 === 0;

    return (
        /* overflow-visible är viktigt för att inte klippa skuggor/scale-effekter */
        <div className="flex flex-row-reverse justify-center gap-0.5 sm:gap-1 mb-1 w-full overflow-visible">
            {seats.map((_, index) => {
                const displayId = previousSeatsCount + index + 1;
                const occupied = isOccupied(displayId);
                const selected = selectedInRow.includes(displayId);

                return (
                    <button
                        key={displayId}
                        onClick={() => !occupied && setSelectedInRow(prev =>
                            prev.includes(displayId) ? prev.filter(s => s !== displayId) : [...prev, displayId]
                        )}
                        disabled={occupied}
                        className={`
              relative flex items-center justify-center font-bold transition-all duration-200 rounded-sm
              
              /* Responsiva storlekar: 24px på mobil, 32px på tablet, 40px på desktop */
              w-6 h-6 sm:w-8 sm:h-8 md:w-10 md:h-10
              text-[8px] sm:text-[10px] md:text-xs

              ${selected
                                ? 'bg-green-600 text-white scale-110 z-10 shadow-lg'
                                : 'bg-accent text-slate-900 hover:brightness-110'
                            }
              ${occupied ? 'cursor-not-allowed opacity-75' : 'cursor-pointer'}
            `}
                    >
                        {displayId}

                        {occupied && (
                            <span className="absolute inset-0 flex items-center justify-center pointer-events-none overflow-hidden rounded-sm">
                                {/* -rotate-45 går från Top-Höger till Bottom-Vänster */}
                                <span className="w-[150%] h-[1.5px] sm:h-[2px] bg-primary -rotate-45 absolute shadow-sm"></span>
                            </span>
                        )}
                    </button>
                );
            })}
        </div>
    );
}