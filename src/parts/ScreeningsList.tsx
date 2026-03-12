import type { Screening } from "../interfaces/Screenings";
import { calculatingTime } from "../utils/lengthcalc";
import { useNavigate } from "react-router-dom";
import { formatTime } from "../utils/formatTime";
import { Clock, MapPin, Film, Ticket, ChevronRight } from "lucide-react";

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
    navigate(`/bokning/${id}`);
  };

  const getDisplayDate = (dateString: string) => {
    const screeningDate = new Date(dateString);
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    screeningDate.setHours(0, 0, 0, 0);
    today.setHours(0, 0, 0, 0);
    tomorrow.setHours(0, 0, 0, 0);

    if (screeningDate.getTime() === today.getTime()) return "";
    if (screeningDate.getTime() === tomorrow.getTime()) return "IMORGON";

    let str = screeningDate.toLocaleDateString('sv-SE', { weekday: 'short', day: 'numeric', month: 'short' });
    return str.toUpperCase().replace('.', '');
  };

  const renderGenres = (catString: string) => {
    if (!catString) return "";
    const genreArray = catString.split(",").map(g => g.trim());
    return genreArray.length <= 2 ? genreArray.join(", ") : `${genreArray[0]}, ${genreArray[1]} ...`;
  };

  return (
    <section>
      {screenings.length === 0 ? (
        <p className="py-16 text-center text-white/20 uppercase tracking-[0.3em] font-light italic">
          Inga visningar hittades
        </p>
      ) : (
        <div className="divide-y divide-white/5">
          {screenings.map((s) => (
            <div
              key={s.id}
              className="py-10 cursor-pointer hover:bg-white/[0.02] transition-all group"
              onClick={() => goToMoreInfo(s.movieId)}
            >
              {/* --- MOBILE layout --- */}
              <div className="space-y-4 md:hidden px-2">
                <div className="flex items-center gap-4">
                  <div className="h-24 w-16 shrink-0 overflow-hidden rounded-lg shadow-xl">
                    <img src={`/images/posters/${s.movieId}.webp`} className="w-full h-full object-cover" alt={s.movieTitle} />
                  </div>
                  <div className="flex flex-col gap-1">
                    <div className="text-lg font-bold text-white">{s.movieTitle}</div>
                    <div className="text-[10px] text-[#c0a060]/80 font-bold uppercase tracking-widest flex items-center gap-1">
                      <Clock size={10} /> {formatTime(s.startTime)} • {s.theaterName}
                    </div>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button onClick={(e) => goToBooking(e, s.id)} className="flex-1 bg-primary py-3 rounded-xl text-xs font-black uppercase text-white">Boka</button>
                  <button onClick={(e) => { e.stopPropagation(); goToMoreInfo(s.movieId); }} className="flex-1 bg-white/5 py-3 rounded-xl text-xs font-bold text-white/70 uppercase tracking-widest">Info</button>
                </div>
              </div>

              {/* --- DESKTOP layout --- */}
              <div className="hidden md:grid md:grid-cols-[1fr_auto] md:items-center pr-4">

                {/* VÄNSTER: Film & Genre */}
                <div className="flex items-center gap-8 relative">
                  <div className="absolute -left-6 opacity-0 group-hover:opacity-100 group-hover:-left-4 transition-all duration-300 text-[#c0a060]">
                    <ChevronRight size={20} />
                  </div>

                  <div className="h-32 w-22 shrink-0 overflow-hidden rounded-xl bg-[#1a1a1a] shadow-2xl group-hover:scale-105 transition-transform duration-500 border border-white/5">
                    <img
                      src={`/images/posters/${s.movieId}.webp`}
                      className="w-full h-full object-cover"
                      alt={s.movieTitle}
                      onError={(e) => (e.target as HTMLImageElement).src = "https://via.placeholder.com/100x150"}
                    />
                  </div>

                  <div className="flex flex-col gap-2">
                    <div className="text-3xl font-black text-white group-hover:text-[#c0a060] transition-colors duration-300 tracking-tighter uppercase">
                      {s.movieTitle}
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-[0.2em] text-[#c0a060]/50">
                        <Film size={14} />
                        {renderGenres((s as any).categories || (s as any).genre)}
                      </span>
                      <span className="text-white/10">|</span>
                      <span className="text-[10px] uppercase tracking-widest text-white/40 font-medium">
                        Längd: {calculatingTime(s.duration)}
                      </span>
                    </div>
                  </div>
                </div>

                {/* HÖGER: Bokningspelare (Salong, Tid & Platser) */}
                <div className="flex flex-col items-end gap-5 pl-8 border-l border-white/5">

                  {/* LOGISTIK-INFO (Staplad snyggt) */}
                  <div className="flex flex-col items-end gap-1.5">
                    {/* Salong */}
                    <div className="flex items-center gap-2 text-white/40 uppercase tracking-[0.2em] text-[10px] font-bold">
                      <MapPin size={12} className="text-[#c0a060]/60" />
                      {s.theaterName} Salong
                    </div>

                    {/* Tid */}
                    <div className="flex items-center gap-2 text-[#c0a060] font-black">
                      <Clock size={16} className="opacity-80" />
                      <span className="text-2xl tracking-tighter">KL. {formatTime(s.startTime)}</span>
                    </div>

                    {/* Platser */}
                    <div className="flex items-center gap-1.5 text-[10px] uppercase tracking-[0.2em] text-white/30 font-bold">
                      <Ticket size={12} className="opacity-50" />
                      <span>{s.availableSeats} / {s.totalAmountOfSeats} platser kvar</span>
                    </div>
                  </div>

                  {/* KNAPPAR */}
                  <div className="flex gap-3">
                    <button
                      onClick={(e) => { e.stopPropagation(); goToMoreInfo(s.movieId); }}
                      className="px-6 py-3 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 text-[10px] font-bold text-white/60 uppercase tracking-[0.2em] transition-all"
                    >
                      Mer info
                    </button>
                    <button
                      onClick={(e) => goToBooking(e, s.id)}
                      className="px-10 py-3 rounded-xl bg-primary text-[10px] font-black text-white uppercase tracking-[0.2em] shadow-[0_10px_25px_-8px_rgba(239,68,68,0.5)] hover:bg-red-700 hover:scale-105 transition-all active:scale-95"
                    >
                      Boka nu
                    </button>
                  </div>
                </div>

              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}