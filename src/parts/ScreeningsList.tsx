import type { Screening } from "../interfaces/Screenings";
import { calculatingTime } from "../utils/lengthcalc.ts";
import { Link, } from "react-router-dom";
import { formatTime } from "../utils/formatTime";
type Props = {
  screenings: Screening[];
};

export default function ScreeningsList({ screenings }: Props) {
  return (
    <section>
      {screenings.length === 0 ? (
        <p className="py-6 text-accent/70">Inga screenings att visa.</p>
      ) : (
        <div className="divide-y divide-white/10">
          {screenings.map(({ id, movieTitle, theaterName, availableSeats, startTime, movieId, duration, totalAmountOfSeats }) => (
            <div key={id} className="py-6">

              {/* MOBILE layout */}
              <div className="space-y-4 md:hidden">
                <div className="text-sm font-semibold text-accent/70">

                  {/* === NY LOGIK: Hämtar klockslag från databasen (startTime) === */}
                  KL. {formatTime(startTime)}
                  {/* ========================================================== */}
                </div>

                <div className="flex items-center gap-4">
                  <div className="h-20 w-14 shrink-0 overflow-hidden rounded-md " />
                  <img src={`/images/posters/${movieId}.webp`} className="w-30 h-40" alt={movieTitle} />
                  <div className="text-base font-semibold text-accent">
                    {movieTitle}
                  </div>
                </div>

                <div>
                  <div className="font-semibold text-accent">

                    {/* === NY LOGIK: Ändrat från salon till theaterName === */}
                    {theaterName} Salong
                    {/* ================================================= */}

                  </div >
                  <div className="text-sm text-accent/70">

                    {/* === NY LOGIK: Hämtar siffran för lediga platser === */}
                    {availableSeats} av {totalAmountOfSeats} platser kvar
                    {/* ================================================ */}
                  </div >
                  <div className="text-sm text-accent/70">

                    {/* === NY LOGIK: Hämtar siffran för lediga platser === */}
                    {calculatingTime(duration)}
                    {/* ================================================ */}
                  </div>



                  <div className="mt-3 flex flex-wrap gap-2">
                    <button className="rounded-full bg-white/10 px-4 py-1.5 text-sm font-semibold text-accent transition hover:bg-white/20">
                      <Link to={`/booking/${id}`} >Boka nu</Link>
                    </button>
                    <button className="rounded-full bg-white/10 px-4 py-1.5 text-sm font-semibold text-accent transition hover:bg-white/20">
                      <Link to={`/film_info/${movieId}`} >Mer info</Link>
                    </button>
                  </div>
                </div >
              </div >



              {/* DESKTOP layout */}
              < div className="hidden md:grid md:grid-cols-[140px_1fr_280px] md:items-center md:py-1" >
                {/* TIME */}

                < div className="text-accent/70" >

                  {/* === NY LOGIK: Formaterar tid för datorvy === */}
                  KL. {formatTime(startTime)}
                  {/* =========================================== */}
                </div >

                {/* TITLE */}
                < div className="flex items-center gap-5" >
                  <div className="h-24 w-16 overflow-hidden rounded-md " />
                  <img src={`/images/posters/${movieId}.webp`} className="w-30 h-40" alt={movieTitle} />
                  <div className="text-base font-semibold text-accent">
                    {movieTitle}
                  </div>
                </div >

                {/* SALON + SEATS + BUTTONS (left aligned + pushed inward) */}
                < div className="justify-self-start pl-6" >
                  <div className="font-semibold text-accent">
                    {/* === NY LOGIK: Kopplat till theaterName === */}
                    {theaterName} Salong
                    {/* ========================================= */}
                  </div >
                  <div className="text-sm text-accent/70">
                    Platser:
                    {/* === NY LOGIK: Kopplat till avaliableSeats === */}
                    <span className="text-accent"> {availableSeats} av {totalAmountOfSeats} platser kvar</span>
                    {/* ============================================ */}

                  </div>
                  <div className="text-sm text-accent/70">
                    Tid:
                    {/* === NY LOGIK: Hanterar duration och bygger om den till timmar och minuter === */}
                    <span className="text-accent"> {calculatingTime(duration)}</span>

                    {/* ============================================ */}

                  </div>

                  <div className="mt-3 flex gap-2">
                    <button className="rounded-full bg-white/10 px-4 py-1.5 text-sm font-semibold text-accent transition hover:bg-white/20">
                      <Link to={`/booking/${id}`} >Boka nu</Link>
                    </button>
                    <button className="rounded-full bg-white/10 px-4 py-1.5 text-sm font-semibold text-accent transition hover:bg-white/20">
                      <Link to={`/film_info/${movieId}`} >Mer info</Link>
                    </button>
                  </div>
                </div >
              </div >
            </div >
          ))
          }
        </div >
      )}
    </section >
  );
}