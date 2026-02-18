import type { ReactNode } from "react";
import { createContext, useState, useContext, useMemo, useCallback } from "react";

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

    const toggleSeat = useCallback((seatId: number) => {
        setSelectedSeats(prev => {
            if (prev.includes(seatId)) {
                return prev.filter(id => id !== seatId);
            }
            return [...prev, seatId];
        });
    }, []);

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
