export interface BookingContextType {

    // --- STATE ---
    selectedSeats: number[]; // De stolar som användaren klickade på
    occupiedSeats: number[]; // De stolar som readan är bokade. Dessa kommer från DB.

    // --- ACTION --- 
    toggleSeat: (seatId: number) => void; // välj eller avvälj stol
    setOccupied: (seatIds: number[]) => void; // Spara upptagna plater från APIt
    clearBooking: () => void; // nollställ allt. 


}