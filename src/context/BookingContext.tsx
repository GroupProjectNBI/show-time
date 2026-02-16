import type { ReactNode } from "react";
import { createContext, useState, useContext } from "react";

// INTERFACE import 
import type { BookingContextType } from "../interfaces/Booking";


// 1. Använd interfacet när vi skapar contexten. 
const BookingContext = createContext<BookingContextType | undefined>(undefined);

export function BookingProvider({ children }: { children: ReactNode }) {
    const [selectedSeats, setSelectedSeats] = useState<number[]>([]);
    const [occupiedSeats, setOccupiedSeats] = useState<number[]>([]);

    const toggleSeat = (seatId: number) => {
        setSelectedSeats(prev => {
            if (prev.includes(seatId)) {
                return prev.filter((id) => id !== seatId);
            } else {
                return [...prev, seatId];
            }
        });
    };

    const setOccupied = (seatIds: number[]) => {
        setOccupiedSeats(seatIds);
    }

    const clearBooking = () => {
        setSelectedSeats([]);
        setOccupiedSeats([]);
    }

    const value = {
        selectedSeats,
        occupiedSeats,
        toggleSeat,
        setOccupied,
        clearBooking
    }

    return (
        <BookingContext.Provider value={value}>
            {children}
        </BookingContext.Provider>
    )


}
export function useBooking(): BookingContextType {
    const context = useContext(BookingContext);
    if (!context) throw new Error("useBooking must be used within BookingProvider");
    return context;
}

