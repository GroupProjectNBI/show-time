import { useState, useEffect } from "react";

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
    <div className="ticketRow">
      <div className="ticketHeader">
        <span>{label} á {price} kr</span>
        <span>{total} kr</span>
      </div>

      <div className="counter">
        <button onClick={decrease}>-</button>
        <span>{count}</span>
        <button onClick={increase}>+</button>
      </div>
    </div>);
}