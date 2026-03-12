import { useEffect, useState, useRef } from "react";
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
import * as signalR from '@microsoft/signalr';
import { findBestSeats } from "../utils/seatFinder";
import { calculateSeat } from "../utils/seatCalculator";
export default function BookingPage() {
    const [seatArray, setSeatArray] = useState<Theater[] | null>(null);
    const [screening, setScreening] = useState<Screening | null>(null);
    const [movie, setMovie] = useState<Movie | null>(null);
    const [connection, setConnection] = useState<signalR.HubConnection | null>(null);
    const [realtimeLockedSeats, setRealtimeLockedSeats] = useState<number[]>([]);

    const navigate = useNavigate();
    const { id } = useParams<{ id: string; }>();
    const prevSelectedSeatsRef = useRef<number[]>([]);

    const {
        selectedSeats, occupiedSeats, toggleSeat, setOccupied,
        ticketCount, selectedSnack, email, totalAmount, clearBooking, setSelectedSeats
    } = useBooking();


    useEffect(() => {
        // Den här koden körs när man kommer in på sidan

        return () => {
            // Den här "cleanup"-funktionen körs när man LÄMNAR sidan
            clearBooking();
        };
    }, [clearBooking]); // Vi lyssnar på clearBooking

    // 1. Hämta statisk data (film, salong, redan sålda stolar)
    useEffect(() => {
        if (!id) return;
        (async () => {
            try {
                const screeningRes = await fetchJson(`/api/v_screenings?where=id=${id}`);
                const current = screeningRes[0];
                setScreening(current);
                if (current) {
                    const tId = current.theaterName === "Stora" ? 1 : 2;
                    setSeatArray(await fetchJson(`/api/Theater?where=id=${tId}`));
                    const mRes = await fetchJson(`/api/v_getMovieDetailsView?where=movieId=${current.movieId}`);
                    if (mRes?.[0]) setMovie(mRes[0]);
                    const occ = await fetchJson(`/api/v_occupied_seats?where=screeningId=${id}`);
                    setOccupied(occ.map((o: any) => o.seatId));
                }
            } catch (e) { console.error("Data-laddning fel:", e); }
        })();
    }, [id, setOccupied]);

    // 2. SignalR-hantering
    useEffect(() => {
        if (!id) return;
        const numericId = parseInt(id, 10);
        let isMounted = true;

        const newConn = new signalR.HubConnectionBuilder()
            .withUrl("/api/seathub")
            .withAutomaticReconnect()
            .build();

        // Lyssnare (Behåll dessa!)
        newConn.on("SeatLocked", (sid: number) => setRealtimeLockedSeats(p => [...p, sid]));
        newConn.on("SeatUnlocked", (sid: number) => setRealtimeLockedSeats(p => p.filter(s => s !== sid)));
        newConn.on("InitialLocks", (ids: number[]) => {
            if (isMounted) {
                console.log("[SignalR] Synkar befintliga lås:", ids);
                setRealtimeLockedSeats(ids);
            }
        });
        newConn.on("SeatsBooked", (seatIds: number[]) => {
            setOccupied(prev => [...prev, ...seatIds]);
            setRealtimeLockedSeats(prev => prev.filter(sid => !seatIds.includes(sid)));
        });

        async function start() {
            try {
                await newConn.start();
                if (isMounted) {
                    console.log("[SignalR] Nu pratar vi via WebSockets!");
                    await newConn.invoke("JoinScreening", numericId);
                    setConnection(newConn);
                }
            } catch (err: any) {
                // HÄR TYSTNAR VI REACTS DUBBEL-RENDERING FEL:
                const isAbort = err.name === 'AbortError' || err.message?.includes('stopped during negotiation');
                if (!isAbort && isMounted) {
                    console.error("[SignalR] Faktiskt anslutningsfel:", err);
                }
            }
        }

        start();

        return () => {
            isMounted = false;
            // Vi kollar state innan vi stoppar för att undvika onödiga loggar
            if (newConn.state !== signalR.HubConnectionState.Disconnected) {
                newConn.stop();
            }
        };
    }, [id, setOccupied]);

    // 3. Auto-synkning av stolar med servern (Lås & Lås upp)
    useEffect(() => {
        if (connection?.state === signalR.HubConnectionState.Connected && id) {
            const numericId = parseInt(id, 10);

            // Vilka stolar har FÖRSVUNNIT från vår markering? -> Lås upp på servern!
            const removed = prevSelectedSeatsRef.current.filter(sid => !selectedSeats.includes(sid));
            removed.forEach(sid => connection.invoke("UnlockSeat", numericId, sid).catch(console.error));

            // Vilka stolar har TILLKOMMIT i vår markering? -> Lås på servern!
            const added = selectedSeats.filter(sid => !prevSelectedSeatsRef.current.includes(sid));
            added.forEach(sid => connection.invoke("LockSeat", numericId, sid).catch(console.error));
        }

        // Spara den nya listan så vi kan jämföra nästa gång
        prevSelectedSeatsRef.current = selectedSeats;
    }, [selectedSeats, connection, id]);

    // 4. Hantera klick på stol
    const handleRealtimeToggleSeat = (seatId: number) => {
        if (realtimeLockedSeats.includes(seatId)) return alert("Platsen är upptagen!");
        // Skicka klicket direkt till Context, så sköter vår FIFO-magi resten!
        toggleSeat(seatId);
    };

    // Auto-markera de bästa platserna när antalet biljetter ändras
    useEffect(() => {
        if (!seatArray || seatArray.length === 0 || !screening || ticketCount === 0) return;

        // Vi kör bara auto-väljaren om vi har färre stolar än biljetter
        if (selectedSeats.length < ticketCount) {
            const theater = seatArray[0];
            const baseIdOffset = screening.theaterName === "Lilla" ? 81 : 0;
            const allUnavailable = [...occupiedSeats, ...realtimeLockedSeats];

            // NYTT: Vi tar den senast valda stolen som startpunkt
            const lastSelected = selectedSeats.length > 0
                ? selectedSeats[selectedSeats.length - 1]
                : undefined;

            const bestSeats = findBestSeats(
                ticketCount,
                theater.seatsPerRow,
                baseIdOffset,
                allUnavailable,
                lastSelected // Skicka med ankaren!
            );

            if (bestSeats.length > 0) {
                setSelectedSeats(bestSeats);
            }
        }
    }, [ticketCount, seatArray, screening, occupiedSeats, realtimeLockedSeats]);

    // 5. Genomför bokning
    const handleBook = async () => {
        if (ticketCount === 0 || selectedSeats.length !== ticketCount) return alert("Välj rätt antal platser!");
        const cleanedEmail = normalizeEmail(email);
        if (!isValidEmail(cleanedEmail)) return alert("Ogiltig e-post!");

        try {
            const code = generate();
            const res = await fetchJson("/api/Booking", {
                method: "POST", headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ screeningId: screening?.id, email: cleanedEmail, snack: selectedSnack, bookingRef: code, totalAmount, status: 1 })
            });
            if (!res?.insertId) throw new Error("Bokning misslyckades");

            // TODO: När EmailService finns ska cancelLink byggas här och skickas med i bokningsmailet.
            
            for (const sId of selectedSeats) {
                await fetchJson("/api/Ticket", {
                    method: "POST", headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ bookingId: res.insertId, screeningId: screening?.id, SeatId: sId, TicketType: 1, price: 140 })
                });
            }

            if (connection?.state === signalR.HubConnectionState.Connected) {
                await connection.invoke("ConfirmBooking", parseInt(id!, 10), selectedSeats);
            }
            clearBooking();
            navigate(`/confirmation/${code}`);
        } catch (e) { alert("Något gick fel vid bokningen!"); }
    };

    if (!seatArray || !screening || !movie) return <div className="text-white p-10">Laddar...</div>;

    const baseIdOffset = screening.theaterName === "Lilla" ? 81 : 0;
    // const currentTheater = seatArray[0];

    return (
        <div className="min-h-screen bg-[#1a1a1a] p-8 flex flex-col items-center pb-2">
            <MovieCard title={screening.movieTitle} genre={movie.categories} ageLimit={movie.ageLimit + " +"}
                dateTimeLabel={formatScreeningDate(screening.startTime)} theaterLabel={screening.theaterName + " Salongen"}
                posterUrl={`/images/posters/${screening.movieId}.webp`} />
            <div className="w-full max-w-4xl my-10"><TicketSelector /></div>
            <div className="flex flex-col gap-1 w-full max-w-4xl">
                {seatArray.map(theater => (
                    <section key={theater.id} className="w-full">
                        {theater.seatsPerRow.map((count, i) => (
                            <Chairs key={i} numberOfSeats={count} realtimeLockedSeats={realtimeLockedSeats}
                                previousSeatsCount={theater.seatsPerRow.slice(0, i).reduce((a, b) => a + b, 0) + baseIdOffset}
                                visualOffset={theater.seatsPerRow.slice(0, i).reduce((a, b) => a + b, 0)}
                                selectedSeats={selectedSeats} occupiedSeats={occupiedSeats} onToggle={handleRealtimeToggleSeat} />
                        ))}
                    </section>
                ))}
            </div>
            <div className="mt-10 w-full max-w-[1200px] px-6">
                <BookingSnackPanel
                    movieTitle={screening.movieTitle}
                    onBook={handleBook}
                    // Vi skapar de snygga raderna här innan vi skickar ner dem
                    seatsLabelLines={selectedSeats.map(sId => {
                        const layout = calculateSeat(sId);
                        return layout.label; // t.ex. "Rad 2, Stol 5"
                    })}
                />
            </div>
        </div>
    );
}

BookingPage.route = { path: "/booking/:id" };