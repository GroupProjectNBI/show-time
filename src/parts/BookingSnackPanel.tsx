import { useMemo, useState } from "react";

type SnackKey = "large" | "medium" | "small";

type Props = {
  movieTitle: string;
  seatsLabelLines: string[];
  ticketCount: number;
  ticketPrice: number;
  snackImageUrl?: string;
  onBook?: (payload: { email: string; snack: SnackKey | null; }) => void;
};

const snackOptions = [
  {
    key: "large" as const,
    title: "Stora menyn",
    desc: "Tre stora popcorn, tre utvalda snacks och tre stora drycker",
    prebookPrice: 189.9,
    onSitePrice: 250,
  },
  {
    key: "medium" as const,
    title: "Mellan menyn",
    desc: "Tre mellan popcorn, två utvalda snacks och tre medium drycker",
    prebookPrice: 149.9,
    onSitePrice: 210,
  },
  {
    key: "small" as const,
    title: "Lilla menyn",
    desc: "Tre små popcorn och tre medium drycker",
    prebookPrice: 119.9,
    onSitePrice: 170,
  },
];

export default function BookingSnackPanel({
  movieTitle,
  seatsLabelLines,
  ticketCount,
  ticketPrice,
  snackImageUrl,
  onBook,
}: Props) {
  const [selectedSnack, setSelectedSnack] = useState<SnackKey | null>(null);
  const [email, setEmail] = useState("");

  const selected = useMemo(
    () => snackOptions.find((s) => s.key === selectedSnack) ?? null,
    [selectedSnack]
  );

  const snacksPrice = selected ? selected.prebookPrice : 0;

  const total = useMemo(() => {
    return ticketCount * ticketPrice + snacksPrice;
  }, [ticketCount, ticketPrice, snacksPrice]);

  const imageSrc = snackImageUrl || "/images/Commercials/popga.jpg";

  return (
    <div className="w-full">
      <div
        className="
          relative w-full rounded-[26px] bg-surface
          px-4 py-5
          text-accent
          shadow-[0_10px_30px_rgba(0,0,0,0.35)]
          sm:px-6 sm:py-6 lg:px-8 lg:py-7
        "
      >
        {/* ÄNDRING:
           Mindre padding runt hela panelen (px-4 istället för större),
           för att göra hela sektionen mer kompakt. */}

        {/* TOP – två kolumner */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[240px_1fr] lg:gap-8">
          {/* ÄNDRING:
             Mindre gap mellan kolumner (gap-6 istället för gap-8/10).
             Lite smalare vänsterkolumn (240px istället för 260px). */}

          {/* Vänster kolumn */}
          <div>
            <div className="text-[16px] font-semibold text-accent">
              {movieTitle}
            </div>

            {/* ÄNDRING:
               Mindre titel (16px istället för 18px) för kompakt känsla. */}

            <div className="mt-1 text-[14px] font-semibold text-accent/90">
              {ticketCount} biljetter
            </div>

            {/* ÄNDRING:
               Mindre spacing ovanför seats (mt-4 istället för mt-6). */}
            <div className="mt-4 space-y-1 text-[12px] font-semibold text-accent/80">
              {seatsLabelLines.slice(0, 7).map((line, idx) => (
                <div key={idx}>{line}</div>
              ))}
            </div>
          </div>

          {/* Höger kolumn */}
          <div>
            <div
              className="
                overflow-hidden rounded-xl
                bg-[#2b282a]
                shadow-[0_12px_28px_rgba(0,0,0,0.35)]
              "
            >
              <img
                src={imageSrc}
                alt="Snacks"
                className="h-[130px] w-full object-cover sm:h-[150px]"
              />
            </div>

            {/* ÄNDRING:
               Bilden har mindre höjd (130px istället för ~160-190px),
               så den inte känns som en banner. */}

            <div className="mt-2 text-[12px] font-semibold text-accent/80">
              Förboka snackset och få det serverat till din stol.
            </div>

            {/* Snackkort – kompaktare */}
            <div className="mt-3 space-y-2">
              {/* ÄNDRING:
                 Mindre mellanrum mellan snackkort (space-y-2 istället för 3/4). */}

              {snackOptions.map((opt) => {
                const checked = opt.key === selectedSnack;

                return (
                  <button
                    key={opt.key}
                    type="button"
                    onClick={() =>
                      setSelectedSnack((prev) => (prev === opt.key ? null : opt.key))
                    }
                    className={[
                      // ÄNDRING:
                      // Mindre padding (py-2.5 istället för 4)
                      // Mindre border-radius (rounded-xl istället för 2xl)
                      "w-full rounded-xl px-3 py-2.5 text-left transition-all duration-200",
                      "bg-[#4a4548] border border-black/10 hover:bg-[#524d50]",
                      checked ? "bg-[#524d50] border-black/20 ring-1 ring-black/20" : "",
                    ].join(" ")}
                  >
                    <div className="flex items-start gap-2.5">
                      {/* ÄNDRING:
                         Mindre radio-knapp (h-4.5 istället för 6) */}
                      <span
                        className={[
                          "mt-1 inline-flex h-4.5 w-4.5 items-center justify-center rounded-full border-2 bg-[#d2c3a1] flex-none",
                          checked ? "border-[#0b0b0c]" : "border-[#bba979]",
                        ].join(" ")}
                      >
                        {checked && (
                          <svg width="11" height="11" viewBox="0 0 24 24" fill="none">
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
                          <div>
                            {/* ÄNDRING:
                               Mindre textstorlekar för kompakt känsla */}
                            <div className="text-[14px] font-semibold text-accent">
                              {opt.title}
                            </div>
                            <div className="text-[12px] text-accent/70">
                              {opt.desc}
                            </div>
                          </div>

                          <div className="sm:text-right">
                            <div className="text-[13px] font-semibold text-accent">
                              {opt.prebookPrice.toFixed(2)} kr
                            </div>
                            <div className="text-[11px] text-accent/60">
                              På plats: {opt.onSitePrice} kr
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

        {/* CHECKOUT UNDER */}
        <div className="mt-8 grid grid-cols-1 gap-3 sm:grid-cols-[1fr_auto] sm:items-end">
          {/* ÄNDRING:
             Mindre top-margin (mt-8 istället för mt-10) */}

          <div>
            <div className="mb-2 text-[12px] font-semibold text-accent/80">
              Email:
            </div>

            <input
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
            {/* ÄNDRING:
               Border i accent-färg.
               Samma höjd som knappen (h-[48px]). */}
          </div>

          <div className="grid gap-2 sm:justify-items-end">
            <div className="flex items-baseline gap-2 whitespace-nowrap sm:justify-end">
              <span className="text-[14px] font-semibold text-accent">
                Totalt:
              </span>
              <span className="tabular-nums text-[20px] font-bold text-accent">
                {Math.round(total)} kr
              </span>
            </div>

            <button
              type="button"
              onClick={() => onBook?.({ email, snack: selectedSnack })}
              className="
                h-[48px] w-full rounded-full bg-primary px-10
                text-[14px] font-extrabold text-accent
                transition-all duration-300
                hover:-translate-y-0.5 active:scale-95
                sm:w-auto
              "
            >
              BOKA
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
