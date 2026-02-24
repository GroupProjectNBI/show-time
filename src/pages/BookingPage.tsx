import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom"; // Lade till useNavigate här
import { formatScreeningDate } from "../utils/formatTime";
import MovieCard from "../parts/MovieCard";
import generate from "../utils/bookingNumberGeneratir";
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

    const navigate = useNavigate(); // Används för navigering efter bokning

    // Hämta id från URL:en (t.ex. /booking/3 -> id blir "3")
    const { id } = useParams<{ id: string; }>();

    // HÄR VAR KONFLIKTEN: Nu hämtar vi allt vi behöver från context
    const {
        selectedSeats,
        occupiedSeats,
        toggleSeat,
        setOccupied,
        tickets,
        handleCode,      // Från HEAD
        ticketCount,     // Från dev
        selectedSnack,   // Från dev
        email,
        totalAmount,     // Från dev
        clearBooking,
    } = useBooking();

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
    // 1. Räkna ut offset baserat på salong
    const baseIdOffset = screening.theaterName === "Lilla" ? 81 : 0;

    // 2. Plocka ut den aktuella salongens layout (bör bara finnas en i arrayen)
    const currentTheater = seatArray[0];

    // 3. Skapa label-strängarna med Rad och Stol
    const selectedSeatsData = selectedSeats
        .slice()
        .sort((a, b) => a - b)
        .map((seatId) => {
            const relativeId = seatId - baseIdOffset;
            let rowNumber = 1;
            let seatNumberInRow = relativeId;

            if (currentTheater && currentTheater.seatsPerRow) {
                let seatsPassed = 0;
                for (let i = 0; i < currentTheater.seatsPerRow.length; i++) {
                    const rowCapacity = currentTheater.seatsPerRow[i];
                    if (relativeId <= seatsPassed + rowCapacity) {
                        rowNumber = i + 1;
                        seatNumberInRow = relativeId - seatsPassed;
                        break;
                    }
                    seatsPassed += rowCapacity;
                }
            }

            return {
                id: seatId, // Detta ID använder vi för POST
                label: `Rad ${rowNumber}, Stol ${seatNumberInRow}` // Detta visar vi i UI
            };
        });

    // För att inte krascha dina nuvarande komponenter skapar vi en ren text-array till UI:t
    const seatsLabelLines = selectedSeatsData.map(s => s.label);

    // Validering + POST till backend när man trycker BOKA
    const handleBook = async () => {
        // 1. Valideringar 
        if (!email.trim() || ticketCount === 0 || selectedSeats.length !== ticketCount) {
            alert("Kontrollera email och antal valda platser.");
            return;
        }

        const ticketTypePool: string[] = [];
        // Denna kommer att göra om tickets till en flat array, Tex: ['pensionar', 'barn']
        Object.entries(tickets).forEach(([type, count]) => {
            // Lägg till typen i listan lika många gånger som count säger
            for (let i = 0; i < count; i++) {
                ticketTypePool.push(type);
            }
        });

        // 2. Mappa ihop stolarna med biljettyperna
        const finalBookingRows = selectedSeats.map((seat, index) => {
            return {
                seatId: seat,
                ticketType: ticketTypePool[index] // Hämta motsvarande typ från poolen
            };
        });

        // 2. Mappning: Översätt text till ID (TicketTypeId)
        const ticketTypeMap: Record<string, number> = {
            ordinarie: 1,
            pensionar: 2,
            barn: 3
        };

        try {
            const code = generate();
            handleCode(code);

            // 2. Skapa bokningen
            // Konfliktlöst: Vi använder koden från HEAD men snacks och totalAmount från dev
            const bookingBody = {
                screeningId: screening.id,
                email: email.trim().toLowerCase(),
                snack: selectedSnack, // Från dev
                bookingRef: code,     // Från HEAD
                totalAmount: totalAmount, // Från dev
                status: 1,
            };

            const resultBookingData = await fetchJson("/api/Booking", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(bookingBody),
            });

            if (resultBookingData?.error || !resultBookingData?.insertId) {
                throw new Error(resultBookingData?.error || "Kunde inte skapa bokning");
            }

            const bookingId = resultBookingData.insertId;

            // 3. Skapa biljetter - Använd for...of för att säkerställa att de körs i ordning
            for (const { seatId, ticketType } of finalBookingRows) {
                const ticketResult = await fetchJson("/api/Ticket", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        bookingId: bookingId,
                        screeningId: screening.id,
                        SeatId: seatId,
                        TicketType: ticketTypeMap[ticketType],
                        price: 140
                    }),
                });

                if (ticketResult?.error) {
                    console.error("Fel vid biljett-post:", ticketResult.error);
                    alert("Något gick fel med bokningen av en av sätena");
                }
            }

            // 4. Avsluta
            clearBooking();
            navigate("/confirmation", { state: { bookingId } });

        } catch (err) {
            console.error("Bokningsfel:", err);
            alert("Något gick fel vid kommunikation med servern.");
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
                            // 1. Räkna ut hur många stolar som finns på tidigare rader (alltid start på 0)
                            const seatsBeforeThisRow = theater.seatsPerRow
                                .slice(0, rowIndex)
                                .reduce((acc, curr) => acc + curr, 0);

                            // 2. ID-offset för databasen (81 om det är Lilla Salongen)
                            const dbOffset = screening.theaterName === "Lilla" ? 81 : 0;

                            return (
                                <div key={`${theater.id}-row-${rowIndex}`} className="w-full">
                                    <Chairs
                                        numberOfSeats={count}
                                        // Här skickar vi ID-basen för logiken (t.ex. 81 + tidigare stolar)
                                        previousSeatsCount={seatsBeforeThisRow + dbOffset}
                                        // HÄR ÄR NYCKELN: Vi skickar en ren offset för siffrorna (alltid start på 0)
                                        visualOffset={seatsBeforeThisRow}
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
    path: "/booking/:id"
};