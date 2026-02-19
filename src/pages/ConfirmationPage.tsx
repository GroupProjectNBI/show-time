import { Link } from "react-router-dom";
import { useMemo } from "react";
import { useBooking } from "../context/BookingContext";

function ConfirmationPage() {
  const {
    selectedSeats,
    tickets,
    selectedSnack,
    email,
    // clearBooking, // om du vill nollställa efter bekräftelse
  } = useBooking();

  const ticketCount = tickets.ordinarie + tickets.pensionar + tickets.barn;

  const ticketTotal = useMemo(() => {
    return (
      tickets.ordinarie * 140 +
      tickets.pensionar * 120 +
      tickets.barn * 90
    );
  }, [tickets]);

  const snackTotal = useMemo(() => {
    if (!selectedSnack) return 0;
    if (selectedSnack === "large") return 189;
    if (selectedSnack === "medium") return 149;
    return 129;
  }, [selectedSnack]);

  const total = ticketTotal + snackTotal;

  const seatsText = useMemo(() => {
    const sorted = selectedSeats.slice().sort((a, b) => a - b);
    return sorted.length ? sorted.join(", ") : "-";
  }, [selectedSeats]);

  const snackLabel = useMemo(() => {
    if (!selectedSnack) return "Ingen meny";
    if (selectedSnack === "large") return "Stora menyn";
    if (selectedSnack === "medium") return "Mellan menyn";
    return "Lilla menyn";
  }, [selectedSnack]);

  return (
    <div className="flex-grow bg-[#1a1a1a] px-4 py-14 text-accent">
      <div className="mx-auto w-full max-w-5xl">
        {/* TOP */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold uppercase tracking-wide">
            Tack för din reservation!
          </h1>

          <p className="mt-2 text-accent/70">
            Du kommer strax att få en bekräftelse via e-post med dina orderdetaljer.
          </p>
        </div>

        {/* GRID */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1.2fr_0.8fr]">
          {/* VÄNSTER: Texten */}
          <div className="rounded-2xl bg-[#232323] p-6 shadow-[0_10px_30px_rgba(0,0,0,0.35)]">
            <div className="space-y-5 text-[15px] leading-relaxed text-accent/85 font-medium">
              <p>
                Vid eventuella frågor är du välkommen att kontakta oss via{" "}
                <span className="text-accent underline underline-offset-4">
                  (länk)
                </span>.
              </p>

              <p>
                Dina platser är reserverade fram tills en timme före filmens start.
              </p>

              <p>
                Du kan även se dina biljetter på Min sida genom att logga in eller
                bli medlem.
              </p>
            </div>

            {/* CTA */}
            <div className="pt-8 flex flex-col gap-3 sm:flex-row sm:justify-end">
              <Link
                to="/"
                className="h-[48px] inline-flex items-center justify-center rounded-full border border-white/15 px-8 text-sm font-bold uppercase tracking-wide text-accent/90 hover:bg-white/5 transition"
              >
                Till startsidan
              </Link>

              <Link
                to="/login"
                className="h-[48px] inline-flex items-center justify-center rounded-full bg-primary px-10 text-sm font-bold uppercase tracking-wide text-accent hover:bg-[#a0001e] transition"
              >
                Bli medlem
              </Link>
            </div>
          </div>

          {/* HÖGER: Sammanfattning */}
          <div className="rounded-2xl bg-[#232323] p-6 shadow-[0_10px_30px_rgba(0,0,0,0.35)]">
            <h2 className="text-[14px] font-extrabold uppercase tracking-wider text-accent/80">
              Din bokning
            </h2>

            <div className="mt-5 space-y-4 text-[14px]">
              <div className="flex items-start justify-between gap-4">
                <span className="text-accent/60">Email</span>
                <span className="font-semibold text-right break-all">
                  {email || "-"}
                </span>
              </div>

              <div className="flex items-start justify-between gap-4">
                <span className="text-accent/60">Biljetter</span>
                <span className="font-semibold text-right">
                  {ticketCount || 0} st
                </span>
              </div>

              <div className="flex items-start justify-between gap-4">
                <span className="text-accent/60">Platser</span>
                <span className="font-semibold text-right">
                  {seatsText}
                </span>
              </div>

              <div className="flex items-start justify-between gap-4">
                <span className="text-accent/60">Snacks</span>
                <span className="font-semibold text-right">
                  {snackLabel}
                </span>
              </div>

              <div className="pt-4 mt-4 border-t border-white/10 flex items-baseline justify-between">
                <span className="text-accent/70 font-bold">Totalt</span>
                <span className="text-[18px] font-extrabold tabular-nums">
                  {Math.round(total)} kr
                </span>
              </div>

              <div className="text-[12px] text-accent/50">
                Detta är en reservation. Betalning sker i samband med ankomst till biografen.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

ConfirmationPage.route = {
  path: "/confirmation",
  menuLabel: "Confirmation",
  hideInMenu: true,
  index: -2,
};

export default ConfirmationPage;
