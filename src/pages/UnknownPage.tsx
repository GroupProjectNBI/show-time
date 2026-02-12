import { useState, useEffect } from "react";
import fetchJson from "../utils/fetchJson.ts";
import type { ITheater } from "../interfaces/Seats.ts";
import Chairs from "../parts/Chairs.tsx";

// Vi definierar route-objektet här (efter import men utanför komponenten)
TestDelux.route = {
    path: '/test',
    menuLabel: 'details',
    index: 2
};

export default function TestDelux() {
    const [seatArray, setSeatArray] = useState<ITheater[] | null>(null);

    useEffect(() => {
        (async () => {
            // Hämtar teaterdata
            const data = await fetchJson('/api/Theater');
            setSeatArray(data);
        })();
    }, []);

    if (!seatArray) {
        return <div className="text-white text-center p-10">Laddar salong...</div>;
    }

    return (
        <div className="min-h-screen bg-[#1a1a1a] p-8 flex flex-col items-center">
            <h1 className="text-white text-2xl mb-2">Biograf Layout</h1>
            {/* Duken / Scenen - Ger en visuell referens för "framåt" sätta den som en egen compoenent för att hantera Trailers med */}
            <div className="w-full max-w-md h-1 bg-white/20 shadow-[0_-10px_20px_rgba(255,255,255,0.1)] mb-12 rounded-full"></div>

            <div className="flex flex-col gap-1 w-full max-w-4xl">
                {seatArray.map((theater) => (
                    <section key={theater.id} className="w-full">
                        {theater.seatsPerRow.map((count, rowIndex) => {

                            // Logik för löpande numrering:
                            // Vi räknar ut summan av alla stolar i raderna FÖRE denna rad
                            const previousSeatsCount = theater.seatsPerRow
                                .slice(0, rowIndex)
                                .reduce((acc, curr) => acc + curr, 0);

                            return (
                                <div key={`${theater.id}-row-${rowIndex}`} className="w-full">
                                    <Chairs
                                        numberOfSeats={count}
                                        previousSeatsCount={previousSeatsCount}
                                        rowId={rowIndex}
                                    />
                                </div>
                            );
                        })}
                    </section>
                ))}
            </div>
        </div>
    );
}