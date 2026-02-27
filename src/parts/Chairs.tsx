interface ChairsProps {
    numberOfSeats: number;
    previousSeatsCount: number;
    visualOffset: number;
    selectedSeats: number[];    // Lista på alla valda stolar (från context)
    occupiedSeats: number[];    // Lista på upptagna stolar (från backend)
    onToggle: (id: number) => void; // Funktion för att klicka
    realtimeLockedSeats?: number[]; // Lista på stolar som NÅGON ANNAN har valt just nu
}

export default function Chairs({
    numberOfSeats,
    previousSeatsCount,
    realtimeLockedSeats = [], // VIKTIGT: Sätt till en tom array som standard så den inte kraschar
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

                // --- NY LOGIK: Kolla alla tre tillstånden ---
                const isOccupied = occupiedSeats.includes(seatId); // Såld i databasen
                const isRealtimeLocked = realtimeLockedSeats.includes(seatId); // Reserverad av någon just nu
                const isSelected = selectedSeats.includes(seatId); // Vald av mig

                // Stolen är o-klickbar om den är SÅLD eller RESERVERAD
                const isDisabled = isOccupied || isRealtimeLocked;

                return (
                    <button
                        key={seatId}
                        onClick={() => !isDisabled && onToggle(seatId)}
                        disabled={isDisabled}
                        className={`
                            relative flex items-center justify-center font-bold transition-all duration-200 rounded-sm
                            w-6 h-6 sm:w-8 sm:h-8 md:w-10 md:h-10 text-[8px] sm:text-[10px] md:text-xs
                            ${isSelected
                                ? 'bg-green-600 text-white scale-110 z-10 shadow-lg' // Min valda stol
                                : isOccupied
                                    ? 'bg-accent text-slate-900 cursor-not-allowed opacity-75' // Helt såld stol (får krysset nedan)
                                    : isRealtimeLocked
                                        ? 'bg-slate-700 text-gray-400 opacity-60 cursor-not-allowed' // Någon annans val! Mörk och oklickbar
                                        : 'bg-accent text-slate-900 hover:brightness-110 cursor-pointer' // Helt ledig stol
                            }
                        `}
                    >
                        {displayNum}
                        {/* Krysset ritas BARA ut om stolen är permanent såld i databasen */}
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