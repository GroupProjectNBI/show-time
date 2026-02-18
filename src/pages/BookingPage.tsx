import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { formatScreeningDate } from "../utils/formatTime";
import MovieCard from "../parts/MovieCard";

import fetchJson from "../utils/fetchJson";
import type { Theater } from "../interfaces/Seats";
import type { Screening } from "../interfaces/Screenings";
import type Movie from "../interfaces/Movie";
import Chairs from "../parts/Chairs";

import { useBooking } from "../context/BookingContext";

import TicketSelector from "../parts/TicketSelector";
import BookingSnackPanel from "../parts/BookingSnackPanel";



export default function BookingPage() {
    const [seatArray, setSeatArray] = useState<Theater[] | null>(null);
    const [screening, setScreening] = useState<Screening | null>(null);
    const [movie, setMovie] = useState<Movie | null>(null);
    // Hämta id från URL:en (t.ex. /booking/3 -> id blir "3")
    const { id } = useParams<{ id: string; }>();

    const { selectedSeats, occupiedSeats, toggleSeat, setOccupied } = useBooking();

    useEffect(() => {
        if (!id) return;

        const loadPageData = async () => {
            try {
                const screeningResult = await fetchJson(`/api/v_screenings?where=id=${id}`);
                const screening = screeningResult[0];
                setScreening(screening);

                if (screening) {
                    // Hämta layout
                    const theaterId = screening.theaterName === "Stora" ? 1 : 2;
                    const layoutData = await fetchJson(`/api/Theater?where=id=${theaterId}`);
                    setSeatArray(layoutData);

                    // 3. Hämta Film-info (Movie) baserat på movieId från visningen
                    // OBS: Använd currentScreening.movieId här!
                    const movieResult = await fetchJson(`/api/v_getMovieDetailsView?where=movieId=${screening.movieId}`);

                    if (movieResult && movieResult.length > 0) {
                        setMovie(movieResult[0]); // Spara objektet
                    }

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
    return screening && movie && (
        <div className="min-h-screen bg-[#1a1a1a] p-8 flex flex-col items-center relative">
            {/*======================
            MOVIECARD
            ========================= */}
            <div className="w-full flex justify-center mb-8">
                <MovieCard
                    title={screening.movieTitle}
                    genre={movie.categories}
                    ageLimit={movie.ageLimit + " +"}
                    dateTimeLabel={formatScreeningDate(screening.startTime)}

                    theaterLabel={screening.theaterName + " Salongen"}
                    posterUrl={`/images/posters/${screening.movieId}.webp`}
                />
            </div>

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
          BOOKING SNACK PANEL 
          ========================= */}
            <div className="w-full flex items-end mt-10">
                <div className="mx-auto w-full max-w-[1200px] px-6 pb-10">
                    <BookingSnackPanel
                        movieTitle="Joker"
                        // Placeholder tills TicketSelector skickar upp data:
                        ticketCount={0}
                        ticketPrice={0}
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

BookingPage.route = {
  path: "/booking/:id"
};

