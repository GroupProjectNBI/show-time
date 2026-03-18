import { useEffect, useRef, useState } from "react";

type TicketProps = {
  label: string;
  price: number;
  initialCount?: number;
  canIncrease: boolean; // NY: Tar emot order från föräldern
  onChange: (count: number) => void;
};

export default function ComponentTicket({
  label,
  price,
  initialCount = 0,
  canIncrease, // Använd denna här!
  onChange,
}: TicketProps) {
  const [count, setCount] = useState(initialCount);
  const lastSentRef = useRef<number>(initialCount);

  useEffect(() => {
    setCount(initialCount);
    lastSentRef.current = initialCount;
  }, [initialCount]);

  useEffect(() => {
    if (lastSentRef.current === count) return;
    lastSentRef.current = count;
    onChange(count);
  }, [count, onChange]);

  const increase = () => {
    if (canIncrease) {
      setCount((prev) => prev + 1);
    }
  };

  const decrease = () => setCount((prev) => (prev > 0 ? prev - 1 : 0));

  return (
    <div className="border-b border-white/5 py-[14px] flex flex-col gap-[10px] md:flex-row md:items-center md:justify-between transition-opacity duration-300">
      <div className="flex justify-between text-[16px] font-medium text-[#C6A96A] md:w-[70%]">
        <span className="opacity-90">{label} á {price} kr</span>
        <span className="font-bold">{count * price} kr</span>
      </div>

      <div className="flex items-center gap-3 md:justify-end">
        <button
          className={`w-10 h-10 rounded-md text-[26px] select-none transition-all
            ${count === 0 ? "bg-white/5 text-white/20 cursor-not-allowed" : "bg-[#C6A96A] text-[#680909] active:scale-90"}`}
          onClick={decrease}
          disabled={count === 0}
          type="button"
        >
          -
        </button>

        <div className="w-[60px] h-10 bg-white/5 text-[#C6A96A] flex items-center justify-center text-[20px] rounded-md font-bold border border-white/10">
          {count}
        </div>

        <button
          className={`w-10 h-10 rounded-md text-[26px] select-none transition-all
            ${!canIncrease ? "bg-white/5 text-white/20 cursor-not-allowed opacity-50" : "bg-[#C6A96A] text-[#115F11] active:scale-90"}`}
          onClick={increase}
          disabled={!canIncrease} // Knappen dör när totalen är 10!
          type="button"
        >
          +
        </button>
      </div>
    </div>
  );
}