import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
// useNavigate;
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

    // const navigate = useNavigate(); // NYTT: för att navigera till confirmation

    // Hämta id från URL:en (t.ex. /booking/3 -> id blir "3")
    const { id } = useParams<{ id: string; }>();

    // NYTT: hämtar även tickets + email för validering innan navigation
    const {
        selectedSeats,
        occupiedSeats,
        toggleSeat,
        setOccupied,
        tickets,
        email,
        selectedSnack,
        clearBooking, // NYTT: nollställer context efter lyckad bokning
    } = useBooking();

    // NYTT: antal biljetter (styr vad som måste vara valt innan man får boka)
    const ticketCount = tickets.ordinarie + tickets.pensionar + tickets.barn;

    useEffect(() => {
        if (!id) return;

        const loadPageData = async () => {
            try {
                const screeningResult = await fetchJson(`/api/v_screenings?where=id=${id}`);
                const currentScreening = screeningResult[0];
                setScreening(currentScreening);

                if (currentScreening) {
                    // Hämta layout
                    const theaterId = currentScreening.theaterName === "Stora" ? 1 : 2;
                    const layoutData = await fetchJson(`/api/Theater?where=id=${theaterId}`);
                    setSeatArray(layoutData);

                    // Hämta Film-info (Movie) baserat på movieId från visningen
                    const movieResult = await fetchJson(
                        `/api/v_getMovieDetailsView?where=movieId=${currentScreening.movieId}`
                    );

                    if (movieResult && movieResult.length > 0) {
                        setMovie(movieResult[0]);
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

    if (!seatArray || !screening || !movie) {
        return <div className="text-white text-center p-10">Laddar...</div>;
    }

    // Enkel label-lista av valda säten (seatId). Kan senare göras om till "Rad X, Stol Y".
    const seatsLabelLines = selectedSeats
        .slice()
        .sort((a, b) => a - b)
        .map((seatId) => `Stol-ID ${seatId}`);

    // NYTT: validering + POST till backend när man trycker BOKA
    const handleBook = async () => {
        if (!email.trim()) {
            alert("Fyll i din email innan du bokar.");
            return;
        }

        if (ticketCount === 0) {
            alert("Välj minst en biljett innan du bokar.");
            return;
        }

        if (selectedSeats.length !== ticketCount) {
            alert(`Du måste välja ${ticketCount} plats(er) innan du bokar.`);
            return;
        }

        try {

            // NYTT: skapar bokningen i backend (Booking + Ticket + EmailsUserUndefined)
            // Hantera detta utifrån vad tabellen ser ut. 
            const resultBookingData = await fetchJson("/api/Booking", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    screeningId: screening.id,
                    // email: email.trim(),
                    snack: selectedSnack, //-> var sätter vi snacks hanteringen ??
                    bookingRef: null,
                    totalAmount: 10000, ///  hämta rätt amount 
                    status: 1,
                    userId: 1, // ändra sen till email i databasen. 
                    createdAtUTC: "2026-02-17 08:48:30",
                    bookingDate: "2026-02-17 08:48:30"
                }),
            });

            // NYTT: backend svarar med { error } om något gick fel
            if (resultBookingData?.error) {
                alert(resultBookingData.error);
                return;
            }
            else {
                // fortsätt med att skapa en skapa en ticket
                // console.log(resultBookingData);
                // här behöver vi hantera detta utifrån antalet säten som vi har valt
                console.log(resultBookingData.id);
                const resultTicketData = await fetchJson("/api/Ticket", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        bookingId: 1,
                        screeningId: screening.id,
                        SeatId: 1,
                        TicketType: 1,
                        price: 140
                    }),
                });
                if (resultTicketData?.error) {
                    alert(resultTicketData.error);
                    return;
                }
                else {

                }
            }

            // NYTT: nollställer context så man inte råkar ha gamla val kvar
            clearBooking();

            // NYTT: skickar med bokningsdata till confirmation via router-state
            // navigate("/confirmation", { state: result }); // state får vi ändra sen med
        } catch (err) {
            console.error(err);
            alert("Något gick fel vid bokningen.");
        }
    };

    return (
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
                        movieTitle={screening.movieTitle} // NYTT: använder rätt titel från screening
                        seatsLabelLines={seatsLabelLines}
                        // NYTT: BOKA-knappen kör samma handleBook som gör POST till backend
                        onBook={handleBook}
                    />
                </div>
            </div>
        </div>
    );
}

BookingPage.route = {
    path: "/booking/:id",
};