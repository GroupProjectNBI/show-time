import type { Screening } from "../interfaces/Screenings";
import { calculatingTime } from "../utils/lengthcalc"; // (Se till att sökvägen stämmer)
import { useNavigate } from "react-router-dom";
import { formatTime } from "../utils/formatTime";

type Props = {
  screenings: Screening[];
};

export default function ScreeningsList({ screenings }: Props) {
  const navigate = useNavigate();

  const goToMoreInfo = (movieId: number | string) => {
    navigate(`/film_info/${movieId}`);
  };

  const goToBooking = (e: React.MouseEvent, id: number | string) => {
    e.stopPropagation();
    navigate(`/booking/${id}`);
  };

  // --- NY FUNKTION: Räkna ut snyggt datum ---
  const getDisplayDate = (dateString: string) => {
    const screeningDate = new Date(dateString);
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    // Nollställ tiden för att bara jämföra datumet
    screeningDate.setHours(0, 0, 0, 0);
    today.setHours(0, 0, 0, 0);
    tomorrow.setHours(0, 0, 0, 0);

    if (screeningDate.getTime() === today.getTime()) return "IDAG";
    if (screeningDate.getTime() === tomorrow.getTime()) return "IMORGON";

    // Annars returnera t.ex. "FRE 20 OKT"
    // Vi använder svensk locale. Om det ser konstigt ut, kolla att webbläsaren kör svenska,
    // annars kan man hårdkoda 'sv-SE' som första argument istället för undefined.
    let str = screeningDate.toLocaleDateString('sv-SE', { weekday: 'short', day: 'numeric', month: 'short' });
    return str.toUpperCase().replace('.', ''); // Tar bort punkter (t.ex "FRE." -> "FRE")
  };

  return (
    <section>
      {screenings.length === 0 ? (
        <p className="py-6 text-accent/70">Inga screenings att visa.</p>
      ) : (
        <div className="divide-y divide-white/10">
          {screenings.map(
            ({
              id,
              movieTitle,
              theaterName,
              availableSeats,
              startTime,
              movieId,
              duration,
              totalAmountOfSeats,
            }) => (
              <div
                key={id}
                className="py-6 cursor-pointer hover:bg-white/5 transition group"
                onClick={() => goToMoreInfo(movieId)}
              >

                {/* --- MOBILE layout --- */}
                <div className="space-y-4 md:hidden">
                  <div className="text-sm font-semibold text-accent/70 flex gap-2 items-center">
                    {/* HÄR: Vi lägger till datumet i guld */}
                    <span className="text-[#c0a060] font-bold tracking-wide">
                      {getDisplayDate(startTime)}
                    </span>
                    <span className="opacity-50">•</span>
                    <span>KL. {formatTime(startTime)}</span>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="h-20 w-14 shrink-0 overflow-hidden rounded-md bg-[#1a1a1a]">
                      <img
                        src={`/images/posters/${movieId}.webp`}
                        className="w-full h-full object-cover"
                        alt={movieTitle}
                        onError={(e) => (e.target as HTMLImageElement).src = "https://via.placeholder.com/100x150"}
                      />
                    </div>
                    <div className="text-base font-semibold text-accent">
                      {movieTitle}
                    </div>
                  </div>

                  <div>
                    <div className="font-semibold text-accent">
                      {theaterName} Salong
                    </div>
                    <div className="text-sm text-accent/70">
                      {availableSeats} av {totalAmountOfSeats} platser kvar
                    </div>
                    <div className="text-sm text-accent/70">
                      {calculatingTime(duration)}
                    </div>

                    <div className="mt-3 flex flex-wrap gap-2">
                      <button
                        onClick={(e) => goToBooking(e, id)}
                        className="rounded-full bg-white/10 px-4 py-1.5 text-sm font-semibold text-accent transition hover:bg-white/20"
                      >
                        Boka nu
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          goToMoreInfo(movieId);
                        }}
                        className="rounded-full bg-white/10 px-4 py-1.5 text-sm font-semibold text-accent transition hover:bg-white/20"
                      >
                        Mer info
                      </button>
                    </div>
                  </div>
                </div>

                {/* --- DESKTOP layout --- */}
                <div className="hidden md:grid md:grid-cols-[140px_1fr_280px] md:items-center md:py-1">

                  {/* KOLUMN 1: TID (Nu med Datum ovanpå!) */}
                  <div className="flex flex-col justify-center">
                    <span className="text-[#c0a060] font-bold text-xs uppercase tracking-wider mb-0.5">
                      {getDisplayDate(startTime)}
                    </span>
                    <span className="text-accent/70 font-semibold text-lg leading-none">
                      KL. {formatTime(startTime)}
                    </span>
                  </div>

                  {/* KOLUMN 2: TITEL & BILD */}
                  <div className="flex items-center gap-5">
                    <div className="h-24 w-16 overflow-hidden rounded-md bg-[#1a1a1a] shadow-md group-hover:scale-105 transition-transform duration-300">
                      <img
                        src={`/images/posters/${movieId}.webp`}
                        className="w-full h-full object-cover"
                        alt={movieTitle}
                        onError={(e) => (e.target as HTMLImageElement).src = "https://via.placeholder.com/100x150"}
                      />
                    </div>
                    <div className="text-base font-semibold text-accent">
                      {movieTitle}
                    </div>
                  </div>

                  {/* KOLUMN 3: SALONG & KNAPPAR */}
                  <div className="justify-self-start pl-6 border-l border-white/5 h-full flex flex-col justify-center w-full">
                    <div className="font-semibold text-accent">
                      {theaterName} Salong
                    </div>
                    <div className="text-sm text-accent/70">
                      {availableSeats} av {totalAmountOfSeats} platser kvar
                    </div>
                    <div className="text-sm text-accent/70">
                      {calculatingTime(duration)}
                    </div>

                    <div className="mt-3 flex gap-2">
                      <button
                        onClick={(e) => goToBooking(e, id)}
                        className="rounded-full bg-white/10 px-4 py-1.5 text-sm font-semibold text-accent transition hover:bg-white/20"
                      >
                        Boka nu
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          goToMoreInfo(movieId);
                        }}
                        className="rounded-full bg-white/10 px-4 py-1.5 text-sm font-semibold text-accent transition hover:bg-white/20"
                      >
                        Mer info
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )
          )}
        </div>
      )}
    </section>
  );
}