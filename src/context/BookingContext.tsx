import type { ReactNode } from "react";
import { createContext, useState, useContext, useMemo, useCallback, useEffect } from "react";
// import generate from "../utils/bookingNumberGeneratir";
import type { BookingContextType } from "../interfaces/Booking";

const BookingContext = createContext<BookingContextType | undefined>(undefined);

/*==================================
ENDA KÄLLAN FÖR PRISER ISTÄLLET FÖR UPPREPNING
====================================*/

const TICKET_PRICES = {
    ordinarie: 140,
    pensionar: 120,
    barn: 90,
} as const;

const SNACK_PRICES: Record<"large" | "medium" | "small", number> = {
    large: 189,
    medium: 149,
    small: 129,
};

export function BookingProvider({ children }: { children: ReactNode; }) {
    const [selectedSeats, setSelectedSeats] = useState<number[]>([]);
    const [occupiedSeats, setOccupiedSeats] = useState<number[]>([]);

    const [tickets, setTickets] = useState({
        ordinarie: 0,
        pensionar: 0,
        barn: 0,
    });

    const [selectedSnack, setSelectedSnack] =
        useState<"large" | "medium" | "small" | null>(null);

    const [email, setEmail] = useState<string>("");


    // NYTT: antal biljetter = max antal stolar som får väljas

    /* "derived values" data som räknas ut från befintliga state/prop värden istället för att lagras separat
      i egen useState-variabel. För att hålla koden "DRY" så vi håller oss till Single Source of Truth */

    //Antal biljetter
    const ticketCount = tickets.ordinarie + tickets.pensionar + tickets.barn;

    //Biljett-total
    const ticketTotal =
        tickets.ordinarie * TICKET_PRICES.ordinarie +
        tickets.pensionar * TICKET_PRICES.pensionar +
        tickets.barn * TICKET_PRICES.barn;

    // Snack-total
    const snackTotal =
        selectedSnack ? SNACK_PRICES[selectedSnack] : 0;

    // TOTALT
    const totalAmount = ticketTotal + snackTotal;

    /*==============================
    LOGIK FÖR STOLAR
    ================================*/
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
        // state
        selectedSeats,
        occupiedSeats,
        tickets,
        selectedSnack,
        email,

        // derived
        ticketCount,
        ticketTotal,
        snackTotal,
        totalAmount,

        // actions
        toggleSeat,
        setOccupied,
        clearBooking,

        setTickets,
        setSelectedSnack,
        setEmail,
    }), [
        selectedSeats,
        occupiedSeats,
        toggleSeat,
        setOccupied,
        clearBooking,
        tickets,
        selectedSnack,
        email,
        ticketCount,
        ticketTotal,
        snackTotal,
        totalAmount,
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