import { useMemo, useState } from "react";

type Props = {
  valueISO: string | null;          // "2026-02-13" eller null
  onChange: (iso: string) => void;  // när man väljer datum
};

function pad2(n: number) {
  return String(n).padStart(2, "0");
}

function toISO(d: Date) {
  return `${d.getFullYear()}-${pad2(d.getMonth() + 1)}-${pad2(d.getDate())}`;
}

function startOfDay(d: Date) {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate());
}

function addMonths(d: Date, delta: number) {
  return new Date(d.getFullYear(), d.getMonth() + delta, 1);
}

function sameDay(a: Date, b: Date) {
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
}

function isBefore(a: Date, b: Date) {
  return a.getTime() < b.getTime();
}

function parseISO(iso: string) {
  const [y, m, d] = iso.split("-").map(Number);
  return new Date(y, m - 1, d);
}

function formatButtonSv(iso: string) {
  const d = parseISO(iso);
  const weekday = new Intl.DateTimeFormat("sv-SE", { weekday: "short" }).format(d);
  const day = new Intl.DateTimeFormat("sv-SE", { day: "2-digit" }).format(d);
  const month = new Intl.DateTimeFormat("sv-SE", { month: "short" }).format(d);
  return `${weekday} ${day} ${month}.`;
}

function formatMonthTitle(d: Date) {
  // “februari 2026”
  const month = new Intl.DateTimeFormat("sv-SE", { month: "long" }).format(d);
  return `${month} ${d.getFullYear()}`;
}

const WEEKDAYS = ["M", "T", "O", "T", "F", "L", "S"]; // mån..sön (kort)

export default function DateDropdown({ valueISO, onChange }: Props) {
  const today = useMemo(() => startOfDay(new Date()), []);
  const [open, setOpen] = useState(false);

  // vilken månad vi visar i kalendern
  const [viewMonth, setViewMonth] = useState<Date>(() => {
    const base = valueISO ? parseISO(valueISO) : today;
    return new Date(base.getFullYear(), base.getMonth(), 1);
  });

  const selected = valueISO ? parseISO(valueISO) : null;

  const buttonText = valueISO ? formatButtonSv(valueISO) : "Välj dag & datum";

  // build calendar grid (mån–sön)
  const days = useMemo(() => {
    const first = new Date(viewMonth.getFullYear(), viewMonth.getMonth(), 1);
    const last = new Date(viewMonth.getFullYear(), viewMonth.getMonth() + 1, 0);

    // JS: 0=sön..6=lör. Vi vill ha måndag som start => justera
    const firstWeekday = (first.getDay() + 6) % 7; // 0= mån ... 6=sön

    const result: { date: Date; inMonth: boolean; }[] = [];

    // leading days (from previous month)
    for (let i = 0; i < firstWeekday; i++) {
      const d = new Date(first);
      d.setDate(d.getDate() - (firstWeekday - i));
      result.push({ date: d, inMonth: false });
    }

    // current month days
    for (let day = 1; day <= last.getDate(); day++) {
      result.push({ date: new Date(viewMonth.getFullYear(), viewMonth.getMonth(), day), inMonth: true });
    }

    // trailing to complete weeks (42 cells => 6 rows)
    while (result.length < 42) {
      const d = new Date(last);
      d.setDate(d.getDate() + (result.length - (firstWeekday + last.getDate()) + 1));
      result.push({ date: d, inMonth: false });
    }

    return result;
  }, [viewMonth]);

  return (
    <div className="relative w-full md:w-auto">
      {/* Button */}
      <button
        type="button"
        className="w-full rounded-xl bg-white/10 px-5 py-2 text-sm font-semibold text-accent transition hover:bg-white/15 md:w-auto"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
      >
        <span className="inline-flex w-full items-center justify-between gap-3">
          <span>{buttonText}</span>
          <span className="opacity-70">▾</span>
        </span>
      </button>

      {/* Dropdown calendar */}
      {open && (
        <div className="absolute left-0 mt-2 w-[min(300px,calc(100vw-64px))] rounded-2xl bg-primary p-3 shadow-[0_18px_40px_rgba(0,0,0,0.55)] ring-1 ring-white/10">
          {/* Month header */}
          <div className="mb-3 flex items-center justify-between">
            <button
              type="button"
              onClick={() => setViewMonth((m) => addMonths(m, -1))}
              className="rounded-lg bg-white/10 px-2 py-1 text-sm font-semibold text-accent/80 transition hover:bg-white/15"
              aria-label="Föregående månad"
            >
              ‹
            </button>

            <div className="text-xs font-semibold text-accent">
              {formatMonthTitle(viewMonth)}
            </div>

            <button
              type="button"
              onClick={() => setViewMonth((m) => addMonths(m, 1))}
              className="rounded-lg bg-white/10 px-2 py-1 text-sm font-semibold text-accent/80 transition hover:bg-white/15"
              aria-label="Nästa månad"
            >
              ›
            </button>
          </div>

          {/* Weekdays */}
          <div className="grid grid-cols-7 gap-1.5 text-center text[11px] font-semibold text-accent/70">
            {WEEKDAYS.map((w) => (
              <div key={w} className="py-1">
                {w}
              </div>
            ))}
          </div>

          {/* Days */}
          <div className="mt-2 grid grid-cols-7 gap-1.5">
            {days.map(({ date, inMonth }, idx) => {
              const d = startOfDay(date);

              const disabled = isBefore(d, today); // endast framåt
              const isToday = sameDay(d, today);
              const isSelected = selected ? sameDay(d, selected) : false;

              return (
                <button
                  key={idx}
                  type="button"
                  disabled={disabled}
                  onClick={() => {
                    onChange(toISO(d));
                    setOpen(false);
                  }}
                  className={[
                    "h-8 rounded-lg text-sm font-medium transition",
                    inMonth ? "text-accent" : "text-accent/40",
                    disabled ? "opacity-30 cursor-not-allowed" : "hover:bg-white/10",
                    // today highlight (accent ring)
                    isToday ? "ring-1 ring-accent/80" : "ring-1 ring-white/10",
                    // selected highlight (fill subtle)
                    isSelected ? "bg-white/10 shadow-[0_10px_18px_rgba(0,0,0,0.35)]" : "bg-transparent",
                  ].join(" ")}
                >
                  {d.getDate()}
                </button>
              );
            })}
          </div>

          {/* Optional close row (small, not a giant button) */}
          <div className="mt-3 flex justify-end">
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="rounded-lg bg-white/10 px-3 py-1.5 text-sm font-semibold text-accent/80 transition hover:bg-white/15"
            >
              Stäng
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
