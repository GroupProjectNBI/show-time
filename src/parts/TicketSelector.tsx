import { useState } from "react";
import ComponentTicket from "./ComponentTicket";

export default function TicketSelector() {
  const [total, setTotal] = useState<{
    [key: string]: { count: number; subtotal: number; };
  }>({});

  const handleChange = (label: string, count: number, subtotal: number) => {
    setTotal((prev) => ({
      ...prev,
      [label]: { count, subtotal },
    }));
  };

  const grandTotal = Object.values(total).reduce((sum, t) => sum + t.subtotal, 0);

  return (
    <div className="w-full max-w-[1420px] mx-auto p-5 bg-[#1a1a1a] rounded-xl">
      <h2 className="text-[22px] mb-5 text-center text-[#C6A96A]">
        Välj biljetter
      </h2>

      <ComponentTicket
        label="Ordinarie"
        price={140}
        initialCount={0}
        onChange={(count, subtotal) => handleChange("Ordinarie", count, subtotal)}
      />

      <ComponentTicket
        label="Pensionär"
        price={120}
        initialCount={0}
        onChange={(count, subtotal) => handleChange("Pensionär", count, subtotal)}
      />

      <ComponentTicket
        label="Barn"
        price={90}
        initialCount={0}
        onChange={(count, subtotal) => handleChange("Barn", count, subtotal)}
      />

      <div className="mt-5 flex justify-between text-xl font-semibold text-[#C6A96A]">
        <span>Total:</span>
        <span>{grandTotal} kr</span>
      </div>
    </div>
  );
}
