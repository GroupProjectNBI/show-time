import { useCallback, useMemo } from "react";
import { useBooking } from "../context/BookingContext";
import ComponentTicket from "./ComponentTicket";

export default function TicketSelector() {
  const { tickets, setTickets } = useBooking();

  const setTicketCount = useCallback(
    (key: "ordinarie" | "pensionar" | "barn", count: number) => {
      setTickets((prev) => ({ ...prev, [key]: count }));
    },
    [setTickets]
  );

  const onOrdinarie = useCallback((count: number) => setTicketCount("ordinarie", count), [setTicketCount]);
  const onPensionar = useCallback((count: number) => setTicketCount("pensionar", count), [setTicketCount]);
  const onBarn = useCallback((count: number) => setTicketCount("barn", count), [setTicketCount]);

  // Räkna ut TOTALT antal biljetter valda just nu
  const totalTicketCount = useMemo(() => {
    return tickets.ordinarie + tickets.pensionar + tickets.barn;
  }, [tickets]);

  const grandTotal = useMemo(() => {
    return tickets.ordinarie * 140 + tickets.pensionar * 120 + tickets.barn * 90;
  }, [tickets]);

  // Är vi vid taket (10)?
  const isMaxReached = totalTicketCount >= 10;

  return (
    <div className="w-full max-w-[1420px] mx-auto p-5 bg-[#1a1a1a] rounded-xl border border-white/5">
      <h2 className="text-[22px] mb-5 text-center text-[#C6A96A] font-bold uppercase tracking-widest">
        Välj biljetter
      </h2>

      <div className="space-y-2">
        <ComponentTicket
          label="Ordinarie"
          price={140}
          initialCount={tickets.ordinarie}
          onChange={onOrdinarie}
          canIncrease={!isMaxReached} // Skicka ner om det går att lägga till fler
        />
        <ComponentTicket
          label="Pensionär"
          price={120}
          initialCount={tickets.pensionar}
          onChange={onPensionar}
          canIncrease={!isMaxReached}
        />
        <ComponentTicket
          label="Barn"
          price={90}
          initialCount={tickets.barn}
          onChange={onBarn}
          canIncrease={!isMaxReached}
        />
      </div>

      <div className="mt-8 flex flex-col items-end gap-1">
        <div className="flex justify-between w-full text-sm text-accent/50 uppercase tracking-tighter">
          <span>Antal: {totalTicketCount} / 10</span>
          <span>{isMaxReached && "Maxgräns nådd"}</span>
        </div>
        <div className="flex justify-between w-full text-2xl font-black text-[#C6A96A] pt-2 border-t border-white/10">
          <span>TOTALT:</span>
          <span>{grandTotal} kr</span>
        </div>
      </div>
    </div>
  );
}