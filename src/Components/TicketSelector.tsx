import { useState } from "react";
import ComponentTicket from "./ComponentTicket";
import styles from "./TicketSelector.module.css";

export default function TicketSelector() {
  const [total, setTotal] = useState(0);

  const handleChange = (label: string, count: number, subtotal: number) => {
    setTotal(prev => {
      const newTotals = {
        ...prev,
        [label]: subtotal
      };
      return newTotals;
    });
  };
  const grandTotal = Object.values(total).reduce((a: number, b: number) => a + b, 0);

  return (
    <div className={styles.wrapper}>
      <h2 className={styles.title}>Välj biljetter</h2>

      <ComponentTicket
        label="Ordninarie"
        price={140}
        initialCount={2}
        onChange={(count, subtotal) => handleChange("Ordinarie", count, subtotal)}
      />

      <ComponentTicket
        label="Pensionär"
        price={90}
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