import type { ReactNode } from "react";
import { createContext, useState, useContext, useMemo, useCallback, useEffect } from "react";
import type { BookingContextType } from "../interfaces/Booking";

const BookingContext = createContext<BookingContextType | undefined>(undefined);

const TICKET_PRICES = {
    ordinarie: 140,
    pensionar: 120,
    barn: 90,
} as const;

const SNACK_PRICE_PER_PERSON = {
    large: 63,
    medium: 49.666,
    small: 43,
} as const;

export function BookingProvider({ children }: { children: ReactNode }) {
    const [selectedSeats, setSelectedSeats] = useState<number[]>([]);
    const [occupiedSeats, setOccupiedSeats] = useState<number[]>([]);
    const [tickets, setTickets] = useState({ ordinarie: 0, pensionar: 0, barn: 0 });
    const [selectedSnack, setSelectedSnack] = useState<"large" | "medium" | "small" | null>(null);
    const [email, setEmail] = useState<string>("");

    const ticketCount = tickets.ordinarie + tickets.pensionar + tickets.barn;
    const ticketTotal =
        tickets.ordinarie * TICKET_PRICES.ordinarie +
        tickets.pensionar * TICKET_PRICES.pensionar +
        tickets.barn * TICKET_PRICES.barn;

    const snackTotal = selectedSnack ? SNACK_PRICE_PER_PERSON[selectedSnack] * ticketCount : 0;
    const totalAmount = ticketTotal + snackTotal;
    const maxSelectableSeats = ticketCount;

    const toggleSeat = useCallback((seatId: number) => {
        setSelectedSeats((prev) => {
            if (prev.includes(seatId)) return prev.filter(id => id !== seatId);
            if (maxSelectableSeats === 0 || prev.length >= maxSelectableSeats) return prev;
            return [...prev, seatId];
        });
    }, [maxSelectableSeats]);

    // Rensar stolar om man minskar antalet biljetter i dropdownen
    useEffect(() => {
        setSelectedSeats((prev) => {
            if (maxSelectableSeats === 0) return [];
            if (prev.length <= maxSelectableSeats) return prev;
            return prev.slice(0, maxSelectableSeats);
        });
    }, [maxSelectableSeats]);

    // VIKTIGT: Exportera settern direkt för att stödja funktionella uppdateringar (prev => ...)
    const setOccupied = setOccupiedSeats;

    const clearBooking = useCallback(() => {
        setSelectedSeats([]);
        setOccupiedSeats([]);
        setTickets({ ordinarie: 0, pensionar: 0, barn: 0 });
        setSelectedSnack(null);
        setEmail("");
    }, []);

    const value = useMemo(() => ({
        selectedSeats, occupiedSeats, tickets, selectedSnack, email,
        ticketCount, ticketTotal, snackTotal, totalAmount,
        toggleSeat, setOccupied, clearBooking,
        setTickets, setSelectedSnack, setEmail,
    }), [selectedSeats, occupiedSeats, toggleSeat, setOccupied, clearBooking, tickets, selectedSnack, email, ticketCount, ticketTotal, snackTotal, totalAmount]);

    return (
        <BookingContext.Provider value={value}>
            {children}
        </BookingContext.Provider>
    );
}

export function useBooking() {
    const context = useContext(BookingContext);
    if (!context) throw new Error("useBooking must be used within BookingProvider");
    return context;
}