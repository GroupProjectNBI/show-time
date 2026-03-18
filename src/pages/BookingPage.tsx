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
        return () => {
            clearBooking();
        };
    }, [clearBooking]);

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

    useEffect(() => {
        if (!id) return;
        const numericId = parseInt(id, 10);
        let isMounted = true;

        const newConn = new signalR.HubConnectionBuilder()
            .withUrl("/api/seathub")
            .withAutomaticReconnect()
            .build();

        newConn.on("SeatLocked", (sid: number) => setRealtimeLockedSeats(p => [...p, sid]));
        newConn.on("SeatUnlocked", (sid: number) => setRealtimeLockedSeats(p => p.filter(s => s !== sid)));
        newConn.on("InitialLocks", (ids: number[]) => {
            if (isMounted) {
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
                    await newConn.invoke("JoinScreening", numericId);
                    setConnection(newConn);
                }
            } catch (err: any) {
                const isAbort = err.name === 'AbortError' || err.message?.includes('stopped during negotiation');
                if (!isAbort && isMounted) {
                    console.error("[SignalR] Faktiskt anslutningsfel:", err);
                }
            }
        }

        start();

        return () => {
            isMounted = false;
            if (newConn.state !== signalR.HubConnectionState.Disconnected) {
                newConn.stop();
            }
        };
    }, [id, setOccupied]);

    useEffect(() => {
        if (connection?.state === signalR.HubConnectionState.Connected && id) {
            const numericId = parseInt(id, 10);

            const removed = prevSelectedSeatsRef.current.filter(sid => !selectedSeats.includes(sid));
            removed.forEach(sid => connection.invoke("UnlockSeat", numericId, sid).catch(console.error));

            const added = selectedSeats.filter(sid => !prevSelectedSeatsRef.current.includes(sid));
            added.forEach(sid => connection.invoke("LockSeat", numericId, sid).catch(console.error));
        }

        prevSelectedSeatsRef.current = selectedSeats;
    }, [selectedSeats, connection, id]);

    const handleRealtimeToggleSeat = (seatId: number) => {
        if (realtimeLockedSeats.includes(seatId)) return alert("Platsen är upptagen!");
        toggleSeat(seatId);
    };

    useEffect(() => {
        if (!seatArray || seatArray.length === 0 || !screening || ticketCount === 0) return;

        if (selectedSeats.length < ticketCount) {
            const theater = seatArray[0];
            const baseIdOffset = screening.theaterName === "Lilla" ? 81 : 0;
            const allUnavailable = [...occupiedSeats, ...realtimeLockedSeats];

            const lastSelected = selectedSeats.length > 0
                ? selectedSeats[selectedSeats.length - 1]
                : undefined;

            const bestSeats = findBestSeats(
                ticketCount,
                theater.seatsPerRow,
                baseIdOffset,
                allUnavailable,
                lastSelected
            );

            if (bestSeats.length > 0) {
                setSelectedSeats(bestSeats);
            }
        }
    }, [ticketCount, seatArray, screening, occupiedSeats, realtimeLockedSeats]);

    const handleBook = async () => {
        if (ticketCount === 0 || selectedSeats.length !== ticketCount) return alert("Välj rätt antal platser!");
        const cleanedEmail = normalizeEmail(email);
        if (!isValidEmail(cleanedEmail)) return alert("Ogiltig e-post!");

        try {
            const code = generate();
            const res = await fetchJson("/api/Booking", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    screeningId: screening?.id,
                    email: cleanedEmail,
                    snack: selectedSnack,
                    bookingRef: code,
                    totalAmount,
                    status: 1
                })
            });

            if (!res?.insertId) throw new Error("Bokning misslyckades");

            for (const sId of selectedSeats) {
                await fetchJson("/api/Ticket", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        bookingId: res.insertId,
                        screeningId: screening?.id,
                        SeatId: sId,
                        TicketType: 1,
                        price: 140
                    })
                });
            }

            await fetchJson("/api/send-booking-confirmation", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ bookingId: res.insertId })
            });

            if (connection?.state === signalR.HubConnectionState.Connected) {
                await connection.invoke("ConfirmBooking", parseInt(id!, 10), selectedSeats);
            }

            clearBooking();
            navigate(`/bekraftelse/${code}`);
        } catch (e) {
            alert("Något gick fel vid bokningen!");
        }
    };

    if (!seatArray || !screening || !movie) return <div className="text-white p-10">Laddar...</div>;

    const baseIdOffset = screening.theaterName === "Lilla" ? 81 : 0;

    return (
        <div className="min-h-screen bg-[#1a1a1a] p-8 flex flex-col items-center pb-2">
            <MovieCard
                title={screening.movieTitle}
                genre={movie.categories}
                ageLimit={movie.ageLimit + " +"}
                dateTimeLabel={formatScreeningDate(screening.startTime)}
                theaterLabel={screening.theaterName + " Salongen"}
                posterUrl={`/images/posters/${screening.movieId}.webp`}
            />

            <div className="w-full max-w-4xl my-10">
                <TicketSelector />
            </div>

            <div className="flex flex-col gap-1 w-full max-w-4xl">
                {seatArray.map(theater => (
                    <section key={theater.id} className="w-full">
                        {theater.seatsPerRow.map((count, i) => (
                            <Chairs
                                key={i}
                                numberOfSeats={count}
                                realtimeLockedSeats={realtimeLockedSeats}
                                previousSeatsCount={theater.seatsPerRow.slice(0, i).reduce((a, b) => a + b, 0) + baseIdOffset}
                                visualOffset={theater.seatsPerRow.slice(0, i).reduce((a, b) => a + b, 0)}
                                selectedSeats={selectedSeats}
                                occupiedSeats={occupiedSeats}
                                onToggle={handleRealtimeToggleSeat}
                            />
                        ))}
                    </section>
                ))}
            </div>

            <div className="w-full max-w-4xl my-10">
                <BookingSnackPanel
                    movieTitle={screening.movieTitle}
                    onBook={handleBook}
                    seatsLabelLines={[...selectedSeats]
                        .sort((a, b) => a - b)
                        .map(sId => {
                            const layout = calculateSeat(
                                sId,
                                seatArray[0].seatsPerRow,
                                baseIdOffset
                            );
                            return layout.label;
                        })}
                />
            </div>
        </div>
    );
}

BookingPage.route = { path: "/bokning/:id" };