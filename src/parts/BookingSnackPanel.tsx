import { useMemo } from "react";
import { useBooking } from "../context/BookingContext";
import { isValidEmail } from "../utils/email";

type Props = {
  movieTitle: string;
  seatsLabelLines: string[];
  snackImageUrl?: string;
  onBook?: () => void;
};

// ⭐ Snack-priser per person (måste matcha BookingContext)
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

// ⭐ Dynamisk text baserat på antal biljetter
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

  const selected = useMemo(
    () => snackOptions.find((s) => s.key === selectedSnack) ?? null,
    [selectedSnack]
  );

  // ⭐ Dynamiskt pris per person × antal biljetter
  const snacksPrice = selected
    ? selected.pricePerPerson * ticketCount
    : 0;

  const imageSrc = snackImageUrl || "/images/Commercials/popga.jpg";

  return (
    <div className="w-full">
      <div className="relative w-full rounded-[26px] bg-surface px-4 py-5 text-accent shadow-[0_10px_30px_rgba(0,0,0,0.35)] sm:px-6 sm:py-6 lg:px-8 lg:py-7">

        {/* TOP – två kolumner */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[240px_1fr] lg:gap-8">

          {/* Vänster: titel + biljetter + säten */}
          <div>
            <div className="text-[16px] font-semibold text-accent">
              {movieTitle}
            </div>

            <div className="mt-1 text-[14px] font-semibold text-accent/90">
              {ticketCount} biljetter
            </div>

            <div className="mt-4 space-y-1 text-[12px] font-semibold text-accent/80">
              {seatsLabelLines.slice(0, 7).map((line, idx) => (
                <div key={idx}>{line}</div>
              ))}
              {seatsLabelLines.length > 7 && (
                <div className="text-accent/60 text-[12px]">
                  + {seatsLabelLines.length - 7} till
                </div>
              )}
            </div>
          </div>

          {/* Höger: bild + text + snackval */}
          <div>
            <div className="overflow-hidden rounded-xl bg-[#2b282a] shadow-[0_12px_28px_rgba(0,0,0,0.35)]">
              <img
                src={imageSrc}
                alt="Snacks"
                className="h-[125px] w-full object-cover sm:h-[145px]"
              />
            </div>

            <div className="mt-2 text-[12px] font-semibold text-accent/80">
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
                    onClick={() =>
                      setSelectedSnack(checked ? null : opt.key)
                    }
                    className={[
                      "w-full rounded-xl px-3 py-2.5 text-left transition-all duration-200",
                      "bg-[#4a4548] border border-black/10 hover:bg-[#524d50]",
                      checked
                        ? "bg-[#524d50] border-black/20 ring-1 ring-black/20"
                        : "",
                    ].join(" ")}
                  >
                    <div className="flex items-start gap-2.5">
                      <span
                        className={[
                          "mt-1 inline-flex h-4.5 w-4.5 items-center justify-center rounded-full border-2 bg-[#d2c3a1] flex-none",
                          checked ? "border-[#0b0b0c]" : "border-[#bba979]",
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
                              stroke="#0b0b0c"
                              strokeWidth="3"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                        )}
                      </span>

                      <div className="flex-1 min-w-0">
                        <div className="flex flex-col gap-1.5 sm:flex-row sm:items-start sm:justify-between">
                          <div className="min-w-0">
                            <div className="text-[14px] font-semibold text-accent leading-tight">
                              {opt.title}
                            </div>

                            {/* ⭐ Dynamisk beskrivning */}
                            <div className="text-[12px] text-accent/70 leading-snug">
                              {getDynamicDesc(opt, ticketCount)}
                            </div>
                          </div>

                          <div className="sm:text-right">
                            {/* ⭐ Dynamiskt pris */}
                            <div className="text-[13px] font-semibold text-accent tabular-nums">
                              {(opt.pricePerPerson * ticketCount).toFixed(0)} kr
                            </div>

                            <div className="text-[11px] text-accent/60 tabular-nums">
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
                h-[48px] w-full rounded-full bg-[#2b282a] px-6
                text-[14px] font-semibold text-[#e8e1e5]
                placeholder:text-accent/60
                border border-accent
                focus:ring-2 focus:ring-primary
                outline-none
              "
            />

            {email.length > 0 && !emailIsValid && (
              <div className="mt-1 text-[12px] text-red-500 font-semibold">
                Ange en giltig emailadress
              </div>
            )}
          </div>

          <div className="grid gap-2 sm:justify-items-end">
            <div className="flex items-baseline gap-2 whitespace-nowrap sm:justify-end">
              <span className="text-[14px] font-semibold text-accent">
                Totalt:
              </span>

              {/* ⭐ totalAmount kommer direkt från BookingContext */}
              <span className="tabular-nums text-[20px] font-bold text-accent">
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
                  : "opacity-50 cursor-not-allowed"}
              `}
            >
              BOKA
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
