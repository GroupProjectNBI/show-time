import type { ReactNode } from "react";
import {
    createContext,
    useState,
    useContext,
    useCallback,  // Används för att memoiserar funktioner
    useMemo       // Används för att memoiserar value-objektet
} from "react";

import type { BookingContextType } from "../interfaces/Booking";

const BookingContext = createContext<BookingContextType | undefined>(undefined);

export function BookingProvider({ children }: { children: ReactNode; }) {
    const [selectedSeats, setSelectedSeats] = useState<number[]>([]);
    const [occupiedSeats, setOccupiedSeats] = useState<number[]>([]);

    /*
      useCallback gör att funktionen inte skapas om vid varje render.
      Utan useCallback får funktionen en ny referens varje gång state ändras.
      Det kan trigga useEffect-loops i komponenter som använder den.
    */
    const toggleSeat = useCallback((seatId: number) => {
        setSelectedSeats((prev) => {
            if (prev.includes(seatId)) {
                return prev.filter((id) => id !== seatId);
            }
            return [...prev, seatId];
        });
    }, []);

    /*
      Memoiseras av samma anledning.
      Annars får setOccupied en ny referens vid varje render,
      vilket kan trigga useEffect om den finns med i dependency-arrayen.
    */
    const setOccupied = useCallback((seatIds: number[]) => {
        setOccupiedSeats(seatIds);
    }, []);

    /*
      Även denna funktion memoiseras för stabil referens.
    */
    const clearBooking = useCallback(() => {
        setSelectedSeats([]);
        setOccupiedSeats([]);
    }, []);

    /*
      Detta var den huvudsakliga orsaken till render-loopen.
  
      Utan useMemo skapas ett nytt value-objekt vid varje render.
      React tolkar det som att context-värdet har ändrats,
      vilket gör att alla components som använder context renderas igen.
  
      useMemo gör att objektet bara skapas om
      när selectedSeats eller occupiedSeats faktiskt ändras.
    */
    const value = useMemo(
        () => ({
            selectedSeats,
            occupiedSeats,
            toggleSeat,
            setOccupied,
            clearBooking,
        }),
        [selectedSeats, occupiedSeats, toggleSeat, setOccupied, clearBooking]
    );

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
