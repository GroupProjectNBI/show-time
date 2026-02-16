import { useState } from "react";
import ComponentTicket from "./ComponentTicket";
import styles from "./TicketSelector.module.css";

export default function TicketSelector() {
  const [total, setTotal] = useState<{
    [key: string]: { count: number; subtotal: number; };
  }>({});

  const handleChange = (label: string, count: number, subtotal: number) => {
    setTotal(prev => ({
      ...prev,
      [label]: { count, subtotal }
    }));
  };

  const grandTotal = Object.values(total).reduce(
    (sum, t) => sum + t.subtotal,
    0
  );

  return (
    <div className={styles.wrapper}>
      <h2 className={styles.title}>Välj biljetter</h2>

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

      <div className={styles.totalRow}>
        <span>Total:</span>
        <span>{grandTotal} kr</span>
      </div>
    </div>
  );
}
