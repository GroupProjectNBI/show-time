import { useEffect, useRef, useState } from "react";

type TicketProps = {
  label: string;
  price: number;
  initialCount?: number;
  onChange: (count: number) => void;
};

export default function ComponentTicket({
  label,
  price,
  initialCount = 0,
  onChange,
}: TicketProps) {
  const [count, setCount] = useState(initialCount);
  const lastSentRef = useRef<number>(initialCount);

  // Synka local state om initialCount ändras (t.ex. clearBooking)
  useEffect(() => {
    setCount(initialCount);
    lastSentRef.current = initialCount;
  }, [initialCount]);

  // Loop-säker: kalla bara onChange när count faktiskt ändrats
  useEffect(() => {
    if (lastSentRef.current === count) return;
    lastSentRef.current = count;
    onChange(count);
  }, [count, onChange]);

  const total = count * price;

  const increase = () => setCount((prev) => prev + 1);
  const decrease = () => setCount((prev) => (prev > 0 ? prev - 1 : 0));

  return (
    <div className="border-b border-[#444] py-[14px] flex flex-col gap-[10px] md:flex-row md:items-center md:justify-between">
      <div className="flex justify-between text-[16px] font-medium text-[#C6A96A] md:w-[75%] md:mb-0">
        <span>
          {label} á {price} kr
        </span>
        <span>{total} kr</span>
      </div>

      <div className="flex items-center gap-3 md:justify-end">
        <button
          className="w-10 h-10 bg-[#C6A96A] rounded-md text-[26px] text-[#680909] cursor-pointer select-none"
          onClick={decrease}
          type="button"
        >
          -
        </button>

        <div className="w-[60px] h-10 bg-[#463F41] text-[#C6A96A] flex items-center justify-center text-[20px] rounded-md">
          {count}
        </div>

        <button
          className="w-10 h-10 bg-[#C6A96A] rounded-md text-[26px] text-[#115F11] cursor-pointer select-none"
          onClick={increase}
          type="button"
        >
          +
        </button>
      </div>
    </div>
  );
}
