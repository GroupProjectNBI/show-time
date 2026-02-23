import type { ReactNode } from "react";
import { createContext, useState, useContext, useMemo, useCallback, useEffect } from "react";
// import generate from "../utils/bookingNumberGeneratir";
import type { BookingContextType } from "../interfaces/Booking";

const BookingContext = createContext<BookingContextType | undefined>(undefined);

export function BookingProvider({ children }: { children: ReactNode; }) {
    const [selectedSeats, setSelectedSeats] = useState<number[]>([]);
    const [occupiedSeats, setOccupiedSeats] = useState<number[]>([]);

    // NYTT: biljetter
    const [tickets, setTickets] = useState<{
        ordinarie: number;
        pensionar: number;
        barn: number;
    }>({
        ordinarie: 0,
        pensionar: 0,
        barn: 0,
    });

    // NYTT: snacks
    const [selectedSnack, setSelectedSnack] =
        useState<"large" | "medium" | "small" | null>(null);

    // NYTT: email
    const [email, setEmail] = useState<string>("");

    // NYTT: antal biljetter = max antal stolar som får väljas
    const maxSelectableSeats = tickets.ordinarie + tickets.pensionar + tickets.barn;

    const toggleSeat = useCallback((seatId: number) => {
        setSelectedSeats((prev) => {
            if (prev.includes(seatId)) {
                return prev.filter(id => id !== seatId);
            }

            // Om inga biljetter valda så välj inga stolar
            if (maxSelectableSeats === 0) return prev;

            // Om max uppnått (alla platser blivit valda) välj inga fler
            if (prev.length >= maxSelectableSeats) return prev;

            //annars lägg till
            return [...prev, seatId];
        });
    }, [maxSelectableSeats]);

    //NYTT: lagt till en useEffect om antal biljetter minskar när man valt stolar
    // 3 biljetter = 3 stolar, minskar man till 2 försvinnedr den tredje automatiskt
    // 0 biljetter = stolarna nollställs
    useEffect(() => {
        setSelectedSeats((prev) => {
            if (maxSelectableSeats === 0) return [];
            if (prev.length <= maxSelectableSeats) return prev;
            return prev.slice(0, maxSelectableSeats);
        });
    }, [maxSelectableSeats]);

    const setOccupied = useCallback((seatIds: number[]) => {
        setOccupiedSeats(seatIds);
    }, []);

    const clearBooking = useCallback(() => {
        setSelectedSeats([]);
        setOccupiedSeats([]);
        setTickets({ ordinarie: 0, pensionar: 0, barn: 0 });
        setSelectedSnack(null);
        setEmail("");
    }, []);

    const value = useMemo(() => ({
        selectedSeats,
        occupiedSeats,
        toggleSeat,
        setOccupied,
        clearBooking,

        // NYTT
        tickets,
        setTickets,
        selectedSnack,
        setSelectedSnack,
        email,
        setEmail
    }), [
        selectedSeats,
        occupiedSeats,
        toggleSeat,
        setOccupied,
        clearBooking,
        tickets,
        selectedSnack,
        email
    ]);

    return (
        <BookingContext.Provider value={value}>
            {children}
        </BookingContext.Provider>
    );
}

export function useBooking(): BookingContextType {
    const context = useContext(BookingContext);
    if (!context) {
        throw new Error("useBooking must be used within BookingProvider");
    }
    return context;
}
