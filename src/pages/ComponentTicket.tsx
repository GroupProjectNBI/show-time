import { useState, useEffect } from 'react';

type TicketProps = {
  label: string;
  price: number;
  initialCount?: number;
  onChange?: (count: number, total: number) => void;
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
    if (onChange) {
      onChange(count, total);
    }
  }, [count, total, onChange]);

  return (
    <div style={styles.container}>
      <div style={styles.labelRow}>
        <span>{label} á {price} kr</span>
        <span>{total} kr</span>
      </div>
      <div style={styles.counterRow}>
        <button onClick={decrease} style={styles.button}>-</button>
        <span style={styles.count}>{count}</span>
        <button onClick={increase} style={styles.button}>+</button>
      </div>
    </div>
  );
}
const styles = {
  container: {
    borderBottom: "1px solid #ccc",
    padding: "12px 0",
    display: "flex",
    flexDirection: "column" as const,
    gap: "8px"
  },
  labelRow: {
    display: "flex",
    justifyContent: "space-between",
    fontSize: "16px",
    fontWeight: 500
  },
  counterRow: {
    display: "flex",
    alignItems: "center",
    gap: "12px"
  },
  button: {
    width: "32px",
    height: "32px",
    fontSize: "20px",
    cursor: "pointer"
  },
  count: {
    minWidth: "20px",
    textAlign: "center" as const,
    fontSize: "18px"
  }
};
