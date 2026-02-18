import { useCallback, useMemo, useState } from "react";
import ComponentTicket from "./ComponentTicket";

export default function TicketSelector() {
  const [total, setTotal] = useState<{
    [key: string]: { count: number; subtotal: number; };
  }>({});

  // Vi använder useCallback så funktionen inte skapas om varje gång komponenten renderas.
  // Annars kan det orsaka en render-loop.
  const handleChange = useCallback((label: string, count: number, subtotal: number) => {
    setTotal((prev) => ({
      ...prev,
      [label]: { count, subtotal },
    }));
  }, []);

  // Dessa callbacks är nu "stabila".
  // Innan skapades nya funktioner direkt i JSX → det orsakade loopen.
  const onOrdinarie = useCallback(
    (count: number, subtotal: number) => handleChange("Ordinarie", count, subtotal),
    [handleChange]
  );

  const onPensionar = useCallback(
    (count: number, subtotal: number) => handleChange("Pensionär", count, subtotal),
    [handleChange]
  );

  const onBarn = useCallback(
    (count: number, subtotal: number) => handleChange("Barn", count, subtotal),
    [handleChange]
  );

  // Räknar ut totalen. useMemo gör att den bara räknas om när total ändras.
  const grandTotal = useMemo(() => {
    return Object.values(total).reduce((sum, t) => sum + t.subtotal, 0);
  }, [total]);

  return (
    <div className="w-full max-w-[1420px] mx-auto p-5 bg-[#1a1a1a] rounded-xl">
      <h2 className="text-[22px] mb-5 text-center text-[#C6A96A]">
        Välj biljetter
      </h2>

      <ComponentTicket
        label="Ordinarie"
        price={140}
        initialCount={0}
        onChange={onOrdinarie}
      />

      <ComponentTicket
        label="Pensionär"
        price={120}
        initialCount={0}
        onChange={onPensionar}
      />

      <ComponentTicket
        label="Barn"
        price={90}
        initialCount={0}
        onChange={onBarn}
      />

      <div className="mt-5 flex justify-between text-xl font-semibold text-[#C6A96A]">
        <span>Total:</span>
        <span>{grandTotal} kr</span>
      </div>
    </div>
  );
}
