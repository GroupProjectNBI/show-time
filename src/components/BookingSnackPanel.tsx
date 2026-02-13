import { useMemo, useState } from "react";

type SnackKey = "large" | "medium" | "small";

type Props = {
  movieTitle: string;
  seatsLabelLines: string[];
  ticketCount: number;
  ticketPrice: number;
  snackImageUrl?: string;
  onBook?: (payload: { email: string; snack: SnackKey | null }) => void;
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
  const [selectedSnack, setSelectedSnack] = useState<SnackKey | null>("large");
  const [email, setEmail] = useState("");

  const selected = useMemo(
    () => snackOptions.find((s) => s.key === selectedSnack) ?? null,
    [selectedSnack]
  );

  const snacksPrice = selected ? selected.prebookPrice : 0;

  const total = useMemo(() => {
    return ticketCount * ticketPrice + snacksPrice;
  }, [ticketCount, ticketPrice, snacksPrice]);

  return (
    <div className="w-full">
      <div className="relative w-full rounded-[26px] bg-[#3f3b3d] px-5 py-6 text-[#0f0f10] shadow-[0_10px_30px_rgba(0,0,0,0.35)] sm:px-8 sm:py-7 lg:px-10 lg:py-8">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-[240px_1fr_220px] lg:gap-10">
          <div className="pt-2">
            <div className="text-[18px] font-semibold text-[#0b0b0c]">
              {movieTitle}
            </div>
            <div className="mt-1 text-[16px] font-semibold text-[#0b0b0c]">
              {ticketCount} Biljetter
            </div>

            <div className="mt-6 space-y-1 text-[14px] font-semibold text-[#0b0b0c]">
              {seatsLabelLines.map((line, idx) => (
                <div key={idx}>{line}</div>
              ))}
            </div>
          </div>

          <div className="relative">
            <div className="absolute -left-5 top-2 hidden h-[170px] w-[3px] rounded bg-[#2f2c2e] lg:block" />

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-[220px_1fr] sm:items-center sm:gap-6">
              <div className="h-[96px] w-full overflow-hidden rounded-[10px] bg-[#2b282a] sm:w-[220px]">
                {snackImageUrl ? (
                  <img
                    src={snackImageUrl}
                    alt="Snacks"
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-[12px] font-semibold text-[#b9b0b4]">
                    Snack-bild
                  </div>
                )}
              </div>

              <div className="text-[16px] font-semibold leading-snug text-[#0b0b0c]">
                Förboka snackset redan nu
                <br />
                och få de serverat till din stol!
              </div>
            </div>

            <div className="mt-8 w-full space-y-6">
              {snackOptions.map((opt) => {
                const checked = opt.key === selectedSnack;

                return (
                  <button
                    key={opt.key}
                    type="button"
                    onClick={() => setSelectedSnack(opt.key)}
                    className={[
                      "group w-full rounded-2xl px-6 py-5 text-left transition-all duration-200",
                      "min-h-[110px]",
                      "flex items-center gap-5",
                      "bg-[#4a4548] border border-black/10",
                      "hover:bg-[#524d50]",
                      checked
                        ? "bg-[#524d50] border-black/20 ring-1 ring-black/20"
                        : "",
                    ].join(" ")}
                  >
                    <span className="flex min-w-0 flex-1 items-center gap-5">
                      <span
                        className={[
                          "flex-none inline-flex h-6 w-6 items-center justify-center rounded-full border-2 bg-[#d2c3a1]",
                          checked ? "border-[#0b0b0c]" : "border-[#bba979]",
                        ].join(" ")}
                        aria-hidden="true"
                      >
                        {checked ? (
                          <svg
                            width="14"
                            height="14"
                            viewBox="0 0 24 24"
                            className="block"
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
                        ) : null}
                      </span>

                      <span className="min-w-0 flex flex-col justify-center">
                        <div className="text-[16px] font-semibold tracking-tight text-[#0b0b0c]">
                          {opt.title}
                        </div>
                        <div className="mt-[2px] text-[14px] font-medium leading-snug text-[#0b0b0c]/70">
                          {opt.desc}
                        </div>
                      </span>
                    </span>

                    <span className="ml-auto text-right lg:min-w-[170px] lg:shrink-0">
                      <div className="whitespace-nowrap tabular-nums text-[15px] font-semibold text-[#0b0b0c]">
                        {opt.prebookPrice.toFixed(2)} kr
                      </div>
                      <div className="whitespace-nowrap tabular-nums text-[12px] text-[#0b0b0c]/60">
                        Pris på plats: {opt.onSitePrice} kr
                      </div>
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="pt-6 text-left lg:pt-[80px] lg:text-right">
            <div className="flex flex-col items-start lg:items-end">
              <div className="flex items-baseline gap-4 whitespace-nowrap lg:justify-end">
                <div className="tabular-nums text-[18px] font-semibold tracking-tight text-[#0b0b0c]">
                  {selected ? `${selected.prebookPrice.toFixed(2)} kr` : "0 kr"}
                </div>
                <div className="text-[13px] font-medium text-[#0b0b0c]/60">
                  Pris på plats: {selected ? `${selected.onSitePrice} kr` : "-"}
                </div>
              </div>
              <div className="my-4 h-px w-24 bg-[#0b0b0c]/20" />
            </div>
          </div>
        </div>

        <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-[1fr_auto] sm:items-end">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Fyll i din email"
            className="
              h-[56px]
              w-full
              rounded-full
              bg-[#2b282a]
              px-7
              text-[14px]
              font-bold
              leading-none
              text-[#e8e1e5]
              placeholder:text-[#e8e1e5]
              focus:ring-2
              focus:ring-primary
              outline-none
              shadow-inner
              sm:w-[380px]
              sm:self-end
            "
          />

          <div className="grid justify-items-end gap-3">
            <div className="flex items-baseline gap-2 whitespace-nowrap">
              <span className="text-[16px] font-semibold text-[#0b0b0c]">
                Totalt:
              </span>
              <span className="tabular-nums text-[22px] font-bold text-[#0b0b0c]">
                {Math.round(total)} kr
              </span>
            </div>

            <button
              type="button"
              onClick={() => onBook?.({ email, snack: selectedSnack })}
              className="
                h-[56px]
                w-full
                rounded-full
                bg-primary
                px-14
                text-[22px]
                font-extrabold
                text-white
                transition-all
                duration-300
                shadow-[0_8px_20px_rgba(0,0,0,0.35)]
                hover:shadow-[0_15px_35px_rgba(0,0,0,0.5)]
                hover:-translate-y-1
                hover:scale-105
                active:scale-95
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
