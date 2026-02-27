import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
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
import { isValidEmail, normalizeEmail } from "../utils/email";

// --- NY IMPORT FÖR SIGNALR ---
import * as signalR from '@microsoft/signalr';

export default function BookingPage() {
    const [seatArray, setSeatArray] = useState<Theater[] | null>(null);
    const [screening, setScreening] = useState<Screening | null>(null);
    const [movie, setMovie] = useState<Movie | null>(null);

    // --- NYA STATES FÖR SIGNALR ---
    const [connection, setConnection] = useState<signalR.HubConnection | null>(null);
    const [realtimeLockedSeats, setRealtimeLockedSeats] = useState<number[]>([]);

    const navigate = useNavigate();
    const { id } = useParams<{ id: string; }>();

    const {
        selectedSeats,
        occupiedSeats,
        toggleSeat,
        setOccupied,
        tickets,
        ticketCount,
        selectedSnack,
        email,
        totalAmount,
        clearBooking,
    } = useBooking();

    // 1. DIN BEFINTLIGA USEEFFECT (Laddar sidans data)
    useEffect(() => {
        if (!id) return;

        const loadPageData = async () => {
            try {
                const screeningResult = await fetchJson(`/api/v_screenings?where=id=${id}`);
                const currentScreening = screeningResult[0];
                setScreening(currentScreening);

                if (currentScreening) {
                    const theaterId = currentScreening.theaterName === "Stora" ? 1 : 2;
                    const layoutData = await fetchJson(`/api/Theater?where=id=${theaterId}`);
                    setSeatArray(layoutData);

                    const movieResult = await fetchJson(
                        `/api/v_getMovieDetailsView?where=movieId=${currentScreening.movieId}`
                    );

                    if (movieResult && movieResult.length > 0) {
                        setMovie(movieResult[0]);
                    }

                    const occupiedResult = await fetchJson(`/api/v_occupied_seats?where=screeningId=${id}`);
                    const occupiedIds = occupiedResult.map((occ: any) => occ.seatId);

                    setOccupied(occupiedIds);
                }
            } catch (error) {
                console.error("DoD-filtrering misslyckades:", error);
            }
        };

        loadPageData();
    }, [id]);

    // 2. NY USEEFFECT FÖR ATT SÄTTA UPP SIGNALR
    useEffect(() => {
        if (!id) return;
        const numericId = parseInt(id, 10);

        const newConnection = new signalR.HubConnectionBuilder()
            .withUrl("/api/seathub")
            .withAutomaticReconnect()
            .build();

        newConnection.on("SeatLocked", (seatId: number) => {
            console.log(`[SignalR] Någon annan låste stol ${seatId}`);
            setRealtimeLockedSeats(prev => [...prev, seatId]);
        });

        newConnection.on("SeatUnlocked", (seatId: number) => {
            console.log(`[SignalR] Någon annan släppte stol ${seatId}`);
            setRealtimeLockedSeats(prev => prev.filter(s => s !== seatId));
        });

        newConnection.on("SeatsBooked", (seatIds: number[]) => {
            console.log(`[SignalR] Någon köpte precis dessa stolar:`, seatIds);
            setOccupied((prev: number[]) => [...prev, ...seatIds]);
            setRealtimeLockedSeats(prev => prev.filter(seatId => !seatIds.includes(seatId)));
        });

        async function startConnection() {
            try {
                await newConnection.start();
                console.log("[SignalR] Uppkopplad!");

                await newConnection.invoke("JoinScreening", numericId);
                setConnection(newConnection);
            } catch (err: any) {
                // Vi fångar specifikt upp Reacts dubbel-rendering och ignorerar felet!
                if (err.name === 'AbortError' || (err.message && err.message.includes('stopped during negotiation'))) {
                    console.log("[SignalR] Första försöket avbröts av React Strict Mode (Detta är helt normalt!)");
                } else {
                    console.error("[SignalR] Något gick faktiskt fel:", err);
                }
            }
        }

        startConnection();

        return () => {
            // Stäng bara ner anslutningen om den faktiskt är igång eller håller på att koppla upp
            if (newConnection.state !== signalR.HubConnectionState.Disconnected) {
                newConnection.stop();
            }
        };
    }, [id]); // Bara 'id' här!

    // 3. NY FUNKTION SOM ERSÄTTER DIN VANLIGA ONTOGGLE
    const handleRealtimeToggleSeat = async (seatId: number) => {
        // Om stolen redan är låst av NÅGON ANNAN i realtid, avbryt!
        if (realtimeLockedSeats.includes(seatId)) {
            alert("Denna stol är precis vald av någon annan!");
            return;
        }

        // Kollar om jag själv har valt stolen tidigare (isåfall vill jag låsa upp den nu)
        const isCurrentlySelectedByMe = selectedSeats.includes(seatId);

        if (connection && id) {
            try {
                const numericId = parseInt(id, 10);
                if (isCurrentlySelectedByMe) {
                    await connection.invoke("UnlockSeat", numericId, seatId);
                } else {
                    await connection.invoke("LockSeat", numericId, seatId);
                }
            } catch (err) {
                console.error("[SignalR] Fel vid låsning av stol:", err);
                return; // Avbryt lokala toggle om servern kraschar
            }
        }

        // Kör er befintliga logik från BookingContext!
        toggleSeat(seatId);
    };


    if (!seatArray || !screening || !movie) {
        return <div className="text-white text-center p-10">Laddar...</div>;
    }

    const baseIdOffset = screening.theaterName === "Lilla" ? 81 : 0;
    const currentTheater = seatArray[0];

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
                id: seatId,
                label: `Rad ${rowNumber}, Stol ${seatNumberInRow}`
            };
        });

    const seatsLabelLines = selectedSeatsData.map(s => s.label);

    const handleBook = async () => {
        if (ticketCount === 0 || selectedSeats.length !== ticketCount) {
            alert("Kontrollera antal biljetter och valda platser.");
            return;
        }

        const cleanedEmail = normalizeEmail(email);

        if (!isValidEmail(cleanedEmail)) {
            alert("Skriv in en giltig emailadress.");
            return;
        }

        const ticketTypePool: string[] = [];
        Object.entries(tickets).forEach(([type, count]) => {
            for (let i = 0; i < count; i++) {
                ticketTypePool.push(type);
            }
        });

        const finalBookingRows = selectedSeats.map((seat, index) => {
            return {
                seatId: seat,
                ticketType: ticketTypePool[index]
            };
        });

        const ticketTypeMap: Record<string, number> = {
            ordinarie: 1,
            pensionar: 2,
            barn: 3
        };

        try {
            const code = generate();

            const bookingBody = {
                screeningId: screening.id,
                email: cleanedEmail,
                snack: selectedSnack,
                bookingRef: code,
                totalAmount: totalAmount,
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

            // --- NYTT: ROPA PÅ SERVER ATT KÖPET ÄR KLART ---
            if (connection && id) {
                const numericId = parseInt(id, 10);
                await connection.invoke("ConfirmBooking", numericId, selectedSeats);
            }

            clearBooking();
            navigate(`/confirmation/${code}`);

        } catch (err) {
            console.error("Bokningsfel:", err);
            alert("Något gick fel vid kommunikation med servern.");
        }
    };

    return (
        <div className="min-h-screen bg-[#1a1a1a] p-8 flex flex-col items-center relative">
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

            <div className="w-full max-w-4xl mb-10">
                <TicketSelector />
            </div>

            <h1 className="text-white text-2xl mb-2">Biograf Layout</h1>
            <div className="w-full max-w-md h-1 bg-white/20 shadow-[0_-10px_20px_rgba(255,255,255,0.1)] mb-12 rounded-full" />

            <div className="flex flex-col gap-1 w-full max-w-4xl">
                {seatArray.map((theater) => (
                    <section key={theater.id} className="w-full">
                        {theater.seatsPerRow.map((count, rowIndex) => {
                            const seatsBeforeThisRow = theater.seatsPerRow
                                .slice(0, rowIndex)
                                .reduce((acc, curr) => acc + curr, 0);

                            const dbOffset = screening.theaterName === "Lilla" ? 81 : 0;

                            return (
                                <div key={`${theater.id}-row-${rowIndex}`} className="w-full">
                                    <Chairs
                                        numberOfSeats={count}
                                        previousSeatsCount={seatsBeforeThisRow + dbOffset}
                                        visualOffset={seatsBeforeThisRow}
                                        selectedSeats={selectedSeats}
                                        occupiedSeats={occupiedSeats}

                                        // --- NYTT: SKICKA IN SIGNALR-STOLAR OCH NY FUNKTION ---
                                        realtimeLockedSeats={realtimeLockedSeats}
                                        onToggle={handleRealtimeToggleSeat}
                                    />
                                </div>
                            );
                        })}
                    </section>
                ))}
            </div>

            <div className="w-full flex items-end mt-10">
                <div className="mx-auto w-full max-w-[1200px] px-6 pb-10">
                    <BookingSnackPanel
                        movieTitle={screening.movieTitle}
                        seatsLabelLines={seatsLabelLines}
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