interface SelectProps {
  label: string;
  value: string;
  changeHandler: (value: string) => void;
  options: string[];
}

export default function Select({ label, value, changeHandler, options }: SelectProps) {
  return (
    <label className="block">
      <div className="mb-2 text-sm font-semibold text-accent/80">
        {label}:
      </div>

      <select
        className="w-full rounded-xl bg-white/10 px-4 py-2 text-sm font-semibold text-accent outline-none ring-1 ring-white/10 transition focus:ring-2 focus:ring-primary/60"
        value={value}
        onChange={(e) => changeHandler(e.target.value)}
      >
        {options.map((x, i) => (
          <option key={i} value={x} className="bg-[#282828] text-accent">
            {x}
          </option>
        ))}
      </select>
    </label>
  );
}
