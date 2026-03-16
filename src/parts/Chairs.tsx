interface ChairsProps {
    numberOfSeats: number;
    previousSeatsCount: number;
    visualOffset: number;
    selectedSeats: number[];
    occupiedSeats: number[];
    onToggle: (id: number) => void;
    realtimeLockedSeats?: number[];
}

export default function Chairs({
    numberOfSeats,
    previousSeatsCount,
    realtimeLockedSeats = [],
    selectedSeats,
    visualOffset,
    occupiedSeats,
    onToggle,
}: ChairsProps) {

    const seats = [...Array(numberOfSeats)];

    return (
        <div className="flex flex-row-reverse justify-center gap-0.5 sm:gap-1 mb-1 w-full overflow-visible">
            {seats.map((_, index) => {
                const seatId = previousSeatsCount + index + 1;
                const displayNum = visualOffset + index + 1;

                const isOccupied = occupiedSeats.includes(seatId);
                const isRealtimeLocked = realtimeLockedSeats.includes(seatId);
                const isSelected = selectedSeats.includes(seatId);

                const isDisabled = isOccupied || isRealtimeLocked;

                return (
                    <button
                        key={seatId}
                        onClick={() => !isDisabled && onToggle(seatId)}
                        disabled={isDisabled}
                        className={`
                            relative flex items-center justify-center font-bold transition-all duration-200 rounded-sm shrink-0
                            w-7 h-7 sm:w-8 sm:h-8 md:w-10 md:h-10
                            text-[9px] sm:text-[10px] md:text-xs
                            ${isSelected
                                ? 'bg-green-600 text-white scale-110 z-10 shadow-lg'
                                : isOccupied
                                    ? 'bg-accent text-slate-900 cursor-not-allowed opacity-75'
                                    : isRealtimeLocked
                                        ? 'bg-slate-700 text-gray-400 opacity-60 cursor-not-allowed'
                                        : 'bg-accent text-slate-900 hover:brightness-110 cursor-pointer'
                            }
                        `}
                    >
                        {displayNum}

                        {isOccupied && (
                            <span className="absolute inset-0 flex items-center justify-center pointer-events-none overflow-hidden rounded-sm">
                                <span className="w-[150%] h-[1px] sm:h-[2px] bg-primary -rotate-45 absolute shadow-sm"></span>
                            </span>
                        )}
                    </button>
                );
            })}
        </div>
    );
}