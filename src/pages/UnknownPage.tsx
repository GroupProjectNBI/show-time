import { useState, useEffect } from "react";
import { useParams } from 'react-router-dom';
import fetchJson from "../utils/fetchJson";
import type { ITheater } from "../interfaces/Seats";
import Chairs from "../parts/Chairs";

// 1. IMPORTERA CONTEXT HOOKEN
import { useBooking } from "../context/BookingContext";

TestDelux.route = {
    path: '/test/:id',
    menuLabel: 'details',
    index: 2
};

export default function TestDelux() {
    const [seatArray, setSeatArray] = useState<ITheater[] | null>(null);

    // Hämta id från URL:en (t.ex. /test/3 -> id blir "3")
    const { id } = useParams<{ id: string }>();



    // 2. HÄMTA DATA OCH FUNKTIONER FRÅN CONTEXT
    const {
        selectedSeats,
        occupiedSeats,
        toggleSeat,
        setOccupied
    } = useBooking();

    useEffect(() => {
        if (!id) return;

        const loadPageData = async () => {
            try {
                // Vi hämtar all data men förbereder för filtrering
                const allScreenings = await fetchJson(`/api/v_screenings`);
                const allOccupied = await fetchJson(`/api/v_occupied_seats`);

                // Logik för att hitta rätt data
                const screening = allScreenings.find((s: any) => s.id === Number(id));

                if (screening) {
                    // Nu har vi all information vi behöver för att visa rätt salong
                    const theaterId = screening.theaterName === "Stora" ? 1 : 2;
                    const layoutData = await fetchJson(`/api/Theater?where=id=${theaterId}`);
                    setSeatArray(layoutData);

                    // Filtrera ut de upptagna stolarna för just denna visning
                    const filteredOccupied = allOccupied
                        .filter((occ: any) => occ.screeningId === Number(id))
                        .map((occ: any) => occ.seatId);

                    setOccupied(filteredOccupied);
                }
            } catch (error) {
                console.error("DoD-filtrering misslyckades:", error);
            }
        };

        loadPageData();
    }, [id]);

    if (!seatArray) {
        return <div className="text-white text-center p-10">Laddar salong...</div>;
    }

    return (
        <div className="min-h-screen bg-[#1a1a1a] p-8 flex flex-col items-center relative">
            <h1 className="text-white text-2xl mb-2">Biograf Layout</h1>

            {/* Duken / Scenen */}
            <div className="w-full max-w-md h-1 bg-white/20 shadow-[0_-10px_20px_rgba(255,255,255,0.1)] mb-12 rounded-full"></div>

            <div className="flex flex-col gap-1 w-full max-w-4xl">
                {seatArray.map((theater) => (
                    <section key={theater.id} className="w-full">
                        {theater.seatsPerRow.map((count, rowIndex) => {

                            // Logik för löpande numrering
                            const previousSeatsCount = theater.seatsPerRow
                                .slice(0, rowIndex)
                                .reduce((acc, curr) => acc + curr, 0);

                            return (
                                <div key={`${theater.id}-row-${rowIndex}`} className="w-full">
                                    <Chairs
                                        numberOfSeats={count}
                                        previousSeatsCount={previousSeatsCount}
                                        // rowId={rowIndex}

                                        // 3. SKICKA NER CONTEXT-DATA TILL STOLARNA
                                        selectedSeats={selectedSeats} // Vilka är valda?
                                        occupiedSeats={occupiedSeats} // Vilka är upptagna?
                                        onToggle={toggleSeat}         // Funktion för att klicka
                                    />
                                </div>
                            );
                        })}
                    </section>
                ))}
            </div>

            {/* ======================================================== */}
            {/* 4. DEBUG / INFO RUTA                                     */}
            {/* ======================================================== */}
            <div className="fixed bottom-6 right-6 bg-gray-900 border border-white/20 p-5 rounded-xl shadow-2xl text-white max-w-xs z-50 backdrop-blur-sm bg-opacity-90">
                <h3 className="font-bold text-accent mb-2 border-b border-white/10 pb-2">
                    Boknings Context
                </h3>
                <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                        <span className="text-gray-400">Antal valda:</span>
                        <span className="font-bold">{selectedSeats.length} st</span>
                    </div>

                    <div>
                        <span className="text-gray-400 block mb-1">Valda IDn:</span>
                        <div className="bg-black/40 p-2 rounded text-xs font-mono break-words min-h-[2rem]">
                            {selectedSeats.length > 0
                                ? selectedSeats.sort((a, b) => a - b).join(", ")
                                : "Inga valda..."}
                        </div>
                    </div>

                    <div>
                        <span className="text-gray-400 block mb-1">Upptagna IDn (Test):</span>
                        <div className="bg-red-900/40 p-2 rounded text-xs font-mono break-words min-h-[2rem]">
                            {occupiedSeats.length > 0
                                ? occupiedSeats.slice(0, 10).join(", ") + (occupiedSeats.length > 10 ? "..." : "")
                                : "Inga upptagna"}
                        </div>
                    </div>

                    <div className="pt-2 mt-2 border-t border-white/10">
                        <button
                            className="w-full bg-accent text-primary font-bold py-1 px-3 rounded hover:brightness-110 transition disabled:opacity-50 disabled:cursor-not-allowed"
                            disabled={selectedSeats.length === 0}
                            onClick={() => alert(`Går vidare till kassan med säten: ${selectedSeats.join(", ")}`)}
                        >
                            Gå till kassan
                        </button>
                    </div>
                </div>
            </div>

        </div>
    );
}