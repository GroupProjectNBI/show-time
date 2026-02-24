export interface BookingContextType {

    // ========================
    // STATE
    // ========================

    // Stolar
    selectedSeats: number[];        // Valda stolar
    occupiedSeats: number[];        // Upptagna stolar från API

    // Biljetter
    tickets: {
        ordinarie: number;
        pensionar: number;
        barn: number;
    };

    // Snacks
    selectedSnack: "large" | "medium" | "small" | null;

    // Kontakt
    email: string;

    //=========================
    // DERIVED VALUES (värden som hämtas och sätts i contexten)
    //=========================

    //Antal biljetter
    ticketCount: number;

    //Biljettpris totalt
    ticketTotal: number;

    //Snackpris
    snackTotal: number;

    // Totalbelopp biljetter + snack
    totalAmount: number;

    // ========================
    // ACTIONS
    // ========================

    // Stol-hantering
    toggleSeat: (seatId: number) => void;
    setOccupied: (seatIds: number[]) => void;
    clearBooking: () => void;

    // Biljetter
    setTickets: React.Dispatch<React.SetStateAction<{
        ordinarie: number;
        pensionar: number;
        barn: number;
    }>>;

    // Snacks
    setSelectedSnack: (value: "large" | "medium" | "small" | null) => void;

    // Email
    setEmail: (value: string) => void;
}
