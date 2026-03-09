import { useEffect, useState, useMemo } from "react";
import { Link, useParams } from "react-router-dom";
import fetchJson from "../utils/fetchJson";
import { formatScreeningDate } from "../utils/formatTime";
import { useOverlay } from "../context/OverlayContext";
import { useAuth } from "../context/AuthContext";

// Datatyper
interface BookingData {
  id: number;
  bookingRef: string;
  email: string;
  totalAmount: number;
  snack: string;
  screeningId: number;
}

interface TicketData {
  id: number;
  seatId: number;
  ticketType: number;
  price: number;
}

interface ScreeningData {
  id: number;
  startTime: string;
  movieTitle: string;
  theaterName: string;
}

export default function ConfirmationPage() {
  const { user } = useAuth();
  const { openMembership } = useOverlay();
  const { bookingRef } = useParams<{ bookingRef: string; }>();

  const [booking, setBooking] = useState<BookingData | null>(null);
  const [tickets, setTickets] = useState<TicketData[]>([]);
  const [screening, setScreening] = useState<ScreeningData | null>(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");



  useEffect(() => {
    const loadData = async () => {
      if (!bookingRef) return;

      try {
        console.log("Hämtar bokning för ref:", bookingRef);

        // 1. Hämta bokningen via ref
        const bookingResult = await fetchJson(`/api/Booking?where=bookingRef=${bookingRef}`);

        if (!bookingResult || bookingResult.length === 0) {
          setError("Kunde inte hitta bokningen.");
          setLoading(false);
          return;
        }

        const foundBooking = bookingResult[0];
        console.log("Bokning hittad:", foundBooking); // <--- KOLLA HÄR I KONSOLEN
        setBooking(foundBooking);

        // --- HÄR ÄR FIXEN ---
        // Vi kollar om det heter 'screeningId' ELLER 'ScreeningId' i datat
        // (as any) låter oss fuska lite för att kolla båda stavningarna
        const screeningIdToFetch = (foundBooking as any).screeningId || (foundBooking as any).ScreeningId;

        console.log("Försöker hämta visning med ID:", screeningIdToFetch);

        if (!screeningIdToFetch) {
          console.error("Varning: Inget screeningId hittades på bokningsobjektet!");
        }

        // 2. Hämta biljetter & Visning parallellt
        const ticketsPromise = fetchJson(`/api/Ticket?where=bookingId=${foundBooking.id}`);

        // Använd det säkra ID:t här:
        const screeningPromise = fetchJson(`/api/v_screenings?where=id=${screeningIdToFetch}`);

        const [ticketsResult, screeningResult] = await Promise.all([ticketsPromise, screeningPromise]);

        setTickets(ticketsResult || []);

        console.log("Visningsresultat:", screeningResult); // <--- KOLLA HÄR OCKSÅ

        if (screeningResult && screeningResult.length > 0) {
          setScreening(screeningResult[0]);
        } else {
          // Om listan är tom, dubbelkolla att tabellen/vyn faktiskt heter 'v_screenings'
          console.warn("Ingen visning hittades. Kolla API-anropet.");
        }

      } catch (err) {
        console.error("Fel vid hämtning:", err);
        setError("Ett tekniskt fel inträffade.");
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [bookingRef]);

  // --- UI LOGIK ---

  const seatsText = useMemo(() => {
    if (tickets.length === 0) return "-";
    return tickets.map((t) => t.seatId).sort((a, b) => a - b).join(", ");
  }, [tickets]);

  const snackLabel = useMemo(() => {
    if (!booking || !booking.snack) return "Ingen meny";
    if (booking.snack === "large") return "Stora menyn";
    if (booking.snack === "medium") return "Mellan menyn";
    if (booking.snack === "small") return "Lilla menyn";
    return booking.snack;
  }, [booking]);

  // --- RENDER ---

  if (loading) {
    return <div className="min-h-screen bg-[#1a1a1a] flex items-center justify-center text-white">Laddar kvitto...</div>;
  }

  if (error || !booking) {
    return (
      <div className="min-h-screen bg-[#1a1a1a] flex flex-col items-center justify-center text-white gap-4">
        <p className="text-red-400 text-xl">{error}</p>
        <Link to="/" className="underline text-accent">Gå till startsidan</Link>
      </div>
    );
  }

  return (
    <div className="flex-grow bg-[#1a1a1a] px-4 py-14 text-accent min-h-screen pb-2">
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

          {/* VÄNSTER: INFO */}
          <div className="rounded-2xl bg-[#232323] p-6 shadow-[0_10px_30px_rgba(0,0,0,0.35)]">
            <div className="space-y-5 text-[15px] leading-relaxed text-accent/85 font-medium">

              <h3 className="text-white font-bold text-lg">Dina biljetter är bokade!</h3>

              {/* FILMINFO - Visas tydligt till vänster */}
              {screening && (
                <div className="p-4 bg-white/5 rounded-lg border border-white/10 mb-4">
                  <h3 className="text-white font-bold text-lg mb-1">{screening.movieTitle}</h3>
                  <p className="text-accent/70 capitalize">
                    {formatScreeningDate(screening.startTime)}
                  </p>
                  <p className="text-accent/70">{screening.theaterName} Salongen</p>
                </div>
              )}

              {/* STATISK TEXT (Tillbaka från gamla versionen) */}
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

            {/* KNAPPAR (Både Startsida och Bli Medlem) */}
            <div className="pt-8 flex flex-col gap-3 sm:flex-row sm:justify-end">
              <Link
                to="/"
                className="h-[48px] inline-flex items-center justify-center rounded-full border border-white/15 px-8 text-sm font-bold uppercase tracking-wide text-accent/90 hover:bg-white/5 transition"
              >
                Till startsidan
              </Link>

              {!user && (
                <button
                  onClick={openMembership}
                  className="h-[48px] inline-flex items-center justify-center rounded-full bg-primary px-10 text-sm font-bold uppercase tracking-wide text-accent hover:bg-[#a0001e] transition"
                >
                  Bli medlem
                </button>
              )}
            </div>
          </div>

          {/* HÖGER: KVITTO */}
          <div className="rounded-2xl bg-[#232323] p-6 shadow-[0_10px_30px_rgba(0,0,0,0.35)] border-t-4 border-red-600">
            <h2 className="text-[14px] font-extrabold uppercase tracking-wider text-accent/80">
              Bokningskod
            </h2>
            <div className="text-3xl text-white font-black tracking-widest my-2 select-all">
              {booking.bookingRef}
            </div>

            <div className="mt-6 space-y-4 text-[14px]">

              {/* FILM & TID I KVITTOT */}
              {screening && (
                <>
                  <div className="flex justify-between border-b border-white/5 pb-2">
                    <span className="text-accent/60">Film</span>
                    <span className="font-semibold text-right text-white">{screening.movieTitle}</span>
                  </div>
                  <div className="flex justify-between border-b border-white/5 pb-2">
                    <span className="text-accent/60">Tid</span>
                    <span className="font-semibold text-right capitalize">
                      {formatScreeningDate(screening.startTime)}
                    </span>
                  </div>
                  <div className="flex justify-between border-b border-white/5 pb-2">
                    <span className="text-accent/60">Salong</span>
                    <span className="font-semibold text-right">{screening.theaterName}</span>
                  </div>
                </>
              )}

              <div className="flex justify-between border-b border-white/5 pb-2">
                <span className="text-accent/60">Email</span>
                <span className="font-semibold text-right break-all">
                  {booking.email}
                </span>
              </div>

              <div className="flex justify-between border-b border-white/5 pb-2">
                <span className="text-accent/60">Biljetter</span>
                <span className="font-semibold text-right">
                  {tickets.length} st
                </span>
              </div>

              <div className="flex justify-between border-b border-white/5 pb-2">
                <span className="text-accent/60">Platser</span>
                <span className="font-semibold text-right">
                  {seatsText}
                </span>
              </div>

              <div className="flex justify-between border-b border-white/5 pb-2">
                <span className="text-accent/60">Snacks</span>
                <span className="font-semibold text-right">
                  {snackLabel}
                </span>
              </div>

              <div className="pt-4 mt-4 border-t border-white/10 flex justify-between items-center">
                <span className="text-accent/70 font-bold">Totalt</span>
                <span className="text-[18px] font-extrabold tabular-nums">
                  {booking.totalAmount} kr
                </span>
              </div>

              <div className="text-[12px] text-accent/50 pt-2">
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
  path: "/confirmation/:bookingRef",
  menuLabel: "Confirmation",
  hideInMenu: true,
  index: -2,
};