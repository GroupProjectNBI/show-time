import { useBooking } from "../context/BookingContext";
import ComponentTicket from "./ComponentTicket";

export default function TicketSelector() {
  const { tickets, setTickets } = useBooking();

  const handleChange = (label: string, count: number) => {
    setTickets((prev) => ({
      ...prev,
      [label]: { count, },
    }));
  };

  const grandTotal =
    tickets.ordinarie * 140 +
    tickets.pensionar * 120 +
    tickets.barn * 90;

  return (
    <div className="w-full max-w-[1420px] mx-auto p-5 bg-[#1a1a1a] rounded-xl">
      <h2 className="text-[22px] mb-5 text-center text-[#C6A96A]">
        Välj biljetter
      </h2>

      <ComponentTicket
        label="ordinarie"
        price={140}
        initialCount={tickets.ordinarie}
        onChange={(count) => handleChange("ordinarie", count)}
      />

      <ComponentTicket
        label="pensionar"
        price={120}
        initialCount={tickets.pensionar}
        onChange={(count) => handleChange("pensionar", count)}
      />

      <ComponentTicket
        label="barn"
        price={90}
        initialCount={tickets.barn}
        onChange={(count) => handleChange("barn", count)}
      />

      <div className="mt-5 flex justify-between text-xl font-semibold text-[#C6A96A]">
        <span>Total:</span>
        <span>{grandTotal} kr</span>
      </div>
    </div>
  );
}
