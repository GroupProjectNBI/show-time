import { useState, useEffect } from "react";
import styles from "./TicketSelector.module.css";

type TicketProps = {
  label: string;
  price: number;
  initialCount?: number;
  onChange: (count: number, total: number) => void;
};

export default function ComponentTicket({
  label,
  price,
  initialCount = 0,
  onChange
}: TicketProps) {
  const [count, setCount] = useState(initialCount);

  const total = count * price;

  const increase = () => setCount(prev => prev + 1);
  const decrease = () => setCount(prev => (prev > 0 ? prev - 1 : 0));

  useEffect(() => {
    onChange(count, total);
  }, [count, total]);

  return (
    <div className={styles.ticketRow}>
      <div className={styles.ticketHeader}>
        <span>{label} á {price} kr</span>
        <span>{total} kr</span>
      </div>

      <div className={styles.counterRow}>
        <button className={styles.minusButton} onClick={decrease}>−</button>

        <div className={styles.countBox}>
          {count}
        </div>

        <button className={styles.plusButton} onClick={increase}>+</button>
      </div>
    </div>
  );
}
