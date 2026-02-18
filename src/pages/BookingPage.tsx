import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import fetchJson from "../utils/fetchJson";
import type { ITheater } from "../interfaces/Seats";
import Chairs from "../parts/Chairs";

import { useBooking } from "../context/BookingContext";

import TicketSelector from "../parts/TicketSelector";
import BookingSnackPanel from "../parts/BookingSnackPanel";

BookingPage.route = {
    path: "/booking/:id",
    index: 2,
    // Ingen menuLabel => ska inte synas som menyval
};

export default function BookingPage() {
    const [seatArray, setSeatArray] = useState<ITheater[] | null>(null);

    // Hämta id från URL:en (t.ex. /booking/3 -> id blir "3")
    const { id } = useParams<{ id: string; }>();

    const { selectedSeats, occupiedSeats, toggleSeat, setOccupied } = useBooking();

    useEffect(() => {
        if (!id) return;

        const loadPageData = async () => {
            try {
                const screeningResult = await fetchJson(`/api/v_screenings?where=id=${id}`);
                const screening = screeningResult[0];

                if (screening) {
                    // Hämta layout
                    const theaterId = screening.theaterName === "Stora" ? 1 : 2;
                    const layoutData = await fetchJson(`/api/Theater?where=id=${theaterId}`);
                    setSeatArray(layoutData);

                    // Hämta upptagna stolar för denna visning
                    const occupiedResult = await fetchJson(`/api/v_occupied_seats?where=screeningId=${id}`);
                    const occupiedIds = occupiedResult.map((occ: any) => occ.seatId);

                    setOccupied(occupiedIds);
                }
            } catch (error) {
                console.error("DoD-filtrering misslyckades:", error);
            }
        };

        loadPageData();
    }, [id, setOccupied]);

    if (!seatArray) {
        return <div className="text-white text-center p-10">Laddar salong...</div>;
    }

    // Enkel label-lista av valda säten (seatId). Kan senare göras om till "Rad X, Stol Y".
    const seatsLabelLines = selectedSeats
        .slice()
        .sort((a, b) => a - b)
        .map((seatId) => `Stol-ID ${seatId}`);

    // returnerar alla komponenter, ingen logik är inlagd än så länge
    return (
        <div className="min-h-screen bg-[#1a1a1a] p-8 flex flex-col items-center relative">
            {/* =========================
          TICKET SELECTOR 
          ========================= */}
            <div className="w-full max-w-4xl mb-10">
                <TicketSelector />
            </div>

            {/* =========================
          STOLSVAL 
          ========================= */}
            <h1 className="text-white text-2xl mb-2">Biograf Layout</h1>

            {/* Duken / Scenen */}
            <div className="w-full max-w-md h-1 bg-white/20 shadow-[0_-10px_20px_rgba(255,255,255,0.1)] mb-12 rounded-full" />

            <div className="flex flex-col gap-1 w-full max-w-4xl">
                {seatArray.map((theater) => (
                    <section key={theater.id} className="w-full">
                        {theater.seatsPerRow.map((count, rowIndex) => {
                            const previousSeatsCount = theater.seatsPerRow
                                .slice(0, rowIndex)
                                .reduce((acc, curr) => acc + curr, 0);

                            return (
                                <div key={`${theater.id}-row-${rowIndex}`} className="w-full">
                                    <Chairs
                                        numberOfSeats={count}
                                        previousSeatsCount={previousSeatsCount}
                                        selectedSeats={selectedSeats}
                                        occupiedSeats={occupiedSeats}
                                        onToggle={toggleSeat}
                                    />
                                </div>
                            );
                        })}
                    </section>
                ))}
            </div>

            {/* =========================
          DEBUG / INFO RUTA 
          ========================= */}
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
                                ? selectedSeats.slice().sort((a, b) => a - b).join(", ")
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
                            type="button"
                        >
                            Gå till kassan
                        </button>
                    </div>
                </div>
            </div>

            {/* =========================
          BOOKING SNACK PANEL 
          ========================= */}
            <div className="w-full flex items-end mt-10">
                <div className="mx-auto w-full max-w-[1200px] px-6 pb-10">
                    <BookingSnackPanel
                        movieTitle="Joker"
                        seatsLabelLines={seatsLabelLines}
                        onBook={({ email, snack }) => {
                            console.log("BOOK:", { email, snack });
                        }}
                    />
                </div>
            </div>
        </div>
    );
}
