import { useState } from "react";

interface ChairsProps {
    numberOfSeats: number;
    previousSeatsCount: number;
    rowId: number;
}

export default function Chairs({ numberOfSeats, previousSeatsCount, rowId }: ChairsProps) {
    const seats = [...Array(numberOfSeats)];

    // Vi använder en lokal state så länge för att kunna "provklicka"
    const [selectedInRow, setSelectedInRow] = useState<number[]>([]);

    // En enkel simulering av upptagna stolar (t.ex. var 5:e stol)
    const isOccupied = (id: number) => id % 5 === 0;

    const toggleSeat = (id: number) => {
        if (isOccupied(id)) return;

        setSelectedInRow(prev =>
            prev.includes(id) ? prev.filter(s => s !== id) : [...prev, id]
        );
    };

    return (
        <div className="flex flex-row-reverse justify-center gap-1 mb-1 w-full">
            {seats.map((_, index) => {
                const displayId = previousSeatsCount + index + 1;
                const occupied = isOccupied(displayId);
                const selected = selectedInRow.includes(displayId);

                return (
                    <button
                        key={displayId}
                        onClick={() => toggleSeat(displayId)}
                        disabled={occupied}
                        className={`
              relative w-6 h-6 sm:w-8 sm:h-8 rounded-sm flex items-center justify-center text-[10px] font-bold transition-all
              ${occupied
                                ? 'bg-zinc-800 text-zinc-600 cursor-not-allowed'
                                : selected
                                    ? 'bg-green-600 text-white scale-110 shadow-lg z-10'
                                    : 'bg-[#c4a47c] text-slate-900 hover:bg-[#d4b48c]'
                            }
            `}
                    >
                        {displayId}

                        {occupied && (
                            <span className="absolute inset-0 flex items-center justify-center pointer-events-none">
                                <span className="w-[120%] h-[1px] bg-red-600 rotate-45 absolute opacity-70"></span>
                                <span className="w-[120%] h-[1px] bg-red-600 -rotate-45 absolute opacity-70"></span>
                            </span>
                        )}
                    </button>
                );
            })}
        </div>
    );
}