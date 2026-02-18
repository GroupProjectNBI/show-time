import { useCallback, useMemo } from "react";
import { useBooking } from "../context/BookingContext";
import ComponentTicket from "./ComponentTicket";

export default function TicketSelector() {
  const { tickets, setTickets } = useBooking();

  const setTicketCount = useCallback(
    (key: "ordinarie" | "pensionar" | "barn", count: number) => {
      setTickets((prev) => ({
        ...prev,
        [key]: count,
      }));
    },
    [setTickets]
  );

  const grandTotal = useMemo(() => {
    return (
      tickets.ordinarie * 140 +
      tickets.pensionar * 120 +
      tickets.barn * 90
    );
  }, [tickets]);

  return (
    <div className="w-full max-w-[1420px] mx-auto p-5 bg-[#1a1a1a] rounded-xl">
      <h2 className="text-[22px] mb-5 text-center text-[#C6A96A]">
        Välj biljetter
      </h2>

      <ComponentTicket
        label="ordinarie"
        price={140}
        initialCount={tickets.ordinarie}
        onChange={(count) => setTicketCount("ordinarie", count)}
      />

      <ComponentTicket
        label="pensionar"
        price={120}
        initialCount={tickets.pensionar}
        onChange={(count) => setTicketCount("pensionar", count)}
      />

      <ComponentTicket
        label="barn"
        price={90}
        initialCount={tickets.barn}
        onChange={(count) => setTicketCount("barn", count)}
      />

      <div className="mt-5 flex justify-between text-xl font-semibold text-[#C6A96A]">
        <span>Total:</span>
        <span>{grandTotal} kr</span>
      </div>
    </div>
  );
}
