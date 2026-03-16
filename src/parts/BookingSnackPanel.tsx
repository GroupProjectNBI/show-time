import { useMemo } from "react";
import { useBooking } from "../context/BookingContext";
import { isValidEmail } from "../utils/email";

type Props = {
  movieTitle: string;
  seatsLabelLines: string[];
  snackImageUrl?: string;
  onBook?: () => void;
};

//  Snack-priser per person (måste matcha BookingContext)
const snackOptions = [
  {
    key: "large" as const,
    title: "Stora menyn",
    base: { popcorn: 1, snacks: 1, drinks: 1 },
    pricePerPerson: 63,
    onSitePricePerPerson: 83.33,
  },
  {
    key: "medium" as const,
    title: "Mellan menyn",
    base: { popcorn: 1, snacks: 1, drinks: 1 },
    pricePerPerson: 49.666,
    onSitePricePerPerson: 70,
  },
  {
    key: "small" as const,
    title: "Lilla menyn",
    base: { popcorn: 1, snacks: 0, drinks: 1 },
    pricePerPerson: 43,
    onSitePricePerPerson: 59.66,
  },
];

// Dynamisk text baserat på antal biljetter
function getDynamicDesc(opt: typeof snackOptions[number], ticketCount: number) {
  const p = opt.base.popcorn * ticketCount;
  const s = opt.base.snacks * ticketCount;
  const d = opt.base.drinks * ticketCount;

  const parts = [];
  if (p > 0) parts.push(`${p} popcorn`);
  if (s > 0) parts.push(`${s} snacks`);
  if (d > 0) parts.push(`${d} dryck${d > 1 ? "er" : ""}`);

  return parts.join(", ");
}

export default function BookingSnackPanel({
  movieTitle,
  seatsLabelLines,
  snackImageUrl,
  onBook,
}: Props) {
  const {
    ticketCount,
    totalAmount,
    selectedSnack,
    setSelectedSnack,
    email,
    setEmail,
  } = useBooking();

  const emailIsValid = useMemo(() => isValidEmail(email), [email]);

  //  Dynamiskt pris per person × antal biljetter

  const imageSrc = snackImageUrl || "/images/Commercials/popga.jpg";

  return (
    <div className="w-full rounded-xl border border-white/5 bg-[#1a1a1a] p-5">
      {/* TOP – två kolumner */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[240px_1fr] lg:gap-8">

        {/* Vänster: titel + biljetter + säten */}
        <div>
          <div className="mb-4 border-b-2 border-red-600 pb-2">
            <div className="text-[18px] font-bold uppercase tracking-wide text-white">
              {movieTitle}
            </div>
          </div>

          <div className="rounded-xl border border-white/5 bg-black/20 p-4">

            {/* HEADER */}
            <div className="flex items-center justify-between border-b border-white/5 pb-2">
              <span className="text-[11px] font-extrabold uppercase tracking-widest text-accent/50">
                Biljetter
              </span>
              <span className="text-[12px] font-bold text-[#C6A96A]">
                {ticketCount} st
              </span>
            </div>

            {/* TABELL HEADER */}
            <div className="mt-3 flex items-center gap-3 border-b border-white/5 pb-1 text-[10px] uppercase tracking-widest text-accent/40">
              <span className="w-[28px]">Rad</span>
              <span className="w-[12px] text-center">|</span>
              <span className="w-[40px]">Plats</span>
            </div>

            {/* PLATSER */}
            <div className="mt-2 space-y-1">
              {seatsLabelLines.map((line, idx) => {
                const parts = line.match(/Rad (\d+),? Stol (\d+)/);

                const row = parts?.[1] ?? "";
                const seat = parts?.[2] ?? "";

                return (
                  <div
                    key={idx}
                    className="flex items-center gap-3 text-[14px] font-semibold text-accent tabular-nums"
                  >
                    <span className="w-[28px]">{row}</span>
                    <span className="w-[12px] text-center text-accent/40">|</span>
                    <span className="w-[40px]">{seat}</span>
                  </div>
                );
              })}
            </div>

          </div>
        </div>

        {/* Höger: bild + text + snackval */}
        <div>
          <div className="overflow-hidden rounded-xl border border-white/5 bg-black/20">
            <img
              src={imageSrc}
              alt="Snacks"
              className="h-[125px] w-full object-cover sm:h-[145px]"
            />
          </div>

          <div className="mt-3 text-[12px] font-semibold text-accent/80">
            Förboka snackset och få det serverat till din stol.
          </div>

          {/* Snackkort */}
          <div className="mt-3 space-y-2">
            {snackOptions.map((opt) => {
              const checked = opt.key === selectedSnack;

              return (
                <button
                  key={opt.key}
                  type="button"
                  onClick={() => setSelectedSnack(checked ? null : opt.key)}
                  className={[
                    "w-full rounded-xl border px-4 py-3 text-left transition-all duration-200",
                    checked
                      ? "border-[#C6A96A]/40 bg-black/30 ring-1 ring-[#C6A96A]/30"
                      : "border-white/5 bg-black/20 hover:border-white/10 hover:bg-black/30",
                  ].join(" ")}
                >
                  <div className="flex items-start gap-3">
                    <span
                      className={[
                        "mt-1 inline-flex h-5 w-5 items-center justify-center rounded-full border-2 flex-none",
                        checked
                          ? "border-[#C6A96A] bg-[#C6A96A]"
                          : "border-[#C6A96A]/60 bg-transparent",
                      ].join(" ")}
                    >
                      {checked && (
                        <svg
                          width="11"
                          height="11"
                          viewBox="0 0 24 24"
                          fill="none"
                        >
                          <path
                            d="M5 13L9 17L19 7"
                            stroke="#111111"
                            strokeWidth="3"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      )}
                    </span>

                    <div className="min-w-0 flex-1">
                      <div className="flex flex-col gap-1.5 sm:flex-row sm:items-start sm:justify-between">
                        <div className="min-w-0">
                          <div className="text-[14px] font-semibold leading-tight text-white">
                            {opt.title}
                          </div>

                          {/*  Dynamisk beskrivning */}
                          <div className="text-[12px] leading-snug text-accent/70">
                            {getDynamicDesc(opt, ticketCount)}
                          </div>
                        </div>

                        <div className="sm:text-right">
                          {/*  Dynamiskt pris */}
                          <div className="tabular-nums text-[13px] font-semibold text-[#C6A96A]">
                            {(opt.pricePerPerson * ticketCount).toFixed(0)} kr
                          </div>

                          <div className="tabular-nums text-[11px] text-accent/60">
                            På plats: {(opt.onSitePricePerPerson * ticketCount).toFixed(0)} kr
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* CHECKOUT */}
      <div className="mt-8 grid grid-cols-1 gap-3 sm:grid-cols-[1fr_auto] sm:items-end">
        <div>
          <div className="mb-2 text-[12px] font-semibold text-accent/80">
            Email:
          </div>

          <input
            name="email"
            autoComplete="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="show-time@example.com"
            className="
              h-[48px] w-full rounded-full border border-white/10 bg-black/20 px-6
              text-[14px] font-semibold text-[#e8e1e5]
              placeholder:text-accent/60
              outline-none
              focus:ring-2 focus:ring-primary
            "
          />

          {email.length > 0 && !emailIsValid && (
            <div className="mt-1 text-[12px] font-semibold text-red-500">
              Ange en giltig emailadress
            </div>
          )}
        </div>

        <div className="grid gap-2 sm:justify-items-end">
          <div className="flex items-baseline gap-2 whitespace-nowrap sm:justify-end">
            <span className="text-[14px] font-semibold text-accent">
              Totalt:
            </span>

            {/*  totalAmount kommer direkt från BookingContext */}
            <span className="tabular-nums text-[20px] font-bold text-[#C6A96A]">
              {Math.round(totalAmount)} kr
            </span>
          </div>

          <button
            type="button"
            disabled={!emailIsValid}
            onClick={() => onBook?.()}
            className={`
              h-[48px] w-full rounded-full px-10
              text-[14px] font-extrabold
              transition-all duration-300
              sm:w-auto
              bg-primary text-accent
              ${emailIsValid
                ? "hover:-translate-y-0.5 active:scale-95"
                : "cursor-not-allowed opacity-50"}
            `}
          >
            BOKA
          </button>
        </div>
      </div>
    </div>
  );
}