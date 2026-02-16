interface ChairsProps {
    numberOfSeats: number;
    previousSeatsCount: number;
    // rowId: number; // <--- LÄGG TILL DENNA RAD!
    // NYA PROPS:
    selectedSeats: number[];    // Lista på alla valda stolar (från context)
    occupiedSeats: number[];    // Lista på upptagna stolar (från backend)
    onToggle: (id: number) => void; // Funktion för att klicka
}

export default function Chairs({
    numberOfSeats,
    previousSeatsCount,
    selectedSeats,
    occupiedSeats,
    onToggle,
    // rowId // <--- LÄGG TILL DENNA OCKSÅ HÄR
}: ChairsProps) {

    const seats = [...Array(numberOfSeats)];

    return (
        <div className="flex flex-row-reverse justify-center gap-0.5 sm:gap-1 mb-1 w-full overflow-visible">
            {seats.map((_, index) => {
                // Samma ID-logik som du hade
                const seatId = previousSeatsCount + index + 1;

                // Kolla status via props istället för lokalt
                const isOccupied = occupiedSeats.includes(seatId);
                const isSelected = selectedSeats.includes(seatId);

                return (
                    <button
                        key={seatId}
                        // Vi kallar på förälderns funktion istället för att sätta state här
                        onClick={() => !isOccupied && onToggle(seatId)}
                        disabled={isOccupied}
                        className={`
                            relative flex items-center justify-center font-bold transition-all duration-200 rounded-sm
                            w-6 h-6 sm:w-8 sm:h-8 md:w-10 md:h-10 text-[8px] sm:text-[10px] md:text-xs
                            ${isSelected
                                ? 'bg-green-600 text-white scale-110 z-10 shadow-lg'
                                : 'bg-accent text-slate-900 hover:brightness-110'
                            }
                            ${isOccupied ? 'cursor-not-allowed opacity-75' : 'cursor-pointer'}
                        `}
                    >
                        {seatId}
                        {isOccupied && (
                            <span className="absolute inset-0 flex items-center justify-center pointer-events-none overflow-hidden rounded-sm">
                                <span className="w-[150%] h-[1.5px] sm:h-[2px] bg-primary -rotate-45 absolute shadow-sm"></span>
                            </span>
                        )}
                    </button>
                );
            })}
        </div>
    );
}