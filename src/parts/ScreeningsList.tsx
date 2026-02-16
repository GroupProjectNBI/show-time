import type { Screening } from "../interfaces/Screenings";
import { Link, } from "react-router-dom";

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
          {screenings.map((s) => (
            <div key={s.id} className="py-6">

              {/* MOBILE layout */}
              <div className="space-y-4 md:hidden">
                <div className="text-sm font-semibold text-accent/70">

                  {/* === NY LOGIK: Hämtar klockslag från databasen (startTime) === */}
                  KL. {new Date(s.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  {/* ========================================================== */}
                </div>

                <div className="flex items-center gap-4">
                  <div className="h-20 w-14 shrink-0 overflow-hidden rounded-md bg-black/30" />
                  <div className="text-base font-semibold text-accent">
                    {s.movieTitle}
                  </div>
                </div>

                <div>
                  <div className="font-semibold text-accent">

                    {/* === NY LOGIK: Ändrat från salon till theaterName === */}
                    Salong {s.theaterName}
                    {/* ================================================= */}

                  </div>
                  <div className="text-sm text-accent/70">

                    {/* === NY LOGIK: Hämtar siffran för lediga platser === */}
                    {s.avaliableSeats} platser kvar
                    {/* ================================================ */}
                  </div>



                  <div className="mt-3 flex flex-wrap gap-2">
                    <button className="rounded-full bg-white/10 px-4 py-1.5 text-sm font-semibold text-accent transition hover:bg-white/20">
                      <Link to={`/test/${s.id}`} >Boka nu</Link>
                    </button>
                    <button className="rounded-full bg-white/10 px-4 py-1.5 text-sm font-semibold text-accent transition hover:bg-white/20">
                      Mer info
                    </button>
                  </div>
                </div>
              </div>



              {/* DESKTOP layout */}
              <div className="hidden md:grid md:grid-cols-[140px_1fr_280px] md:items-center md:py-1">
                {/* TIME */}

                <div className="text-accent/70">

                  {/* === NY LOGIK: Formaterar tid för datorvy === */}
                  KL. {new Date(s.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  {/* =========================================== */}
                </div>

                {/* TITLE */}
                <div className="flex items-center gap-5">
                  <div className="h-24 w-16 overflow-hidden rounded-md bg-black/30" />
                  <div className="text-base font-semibold text-accent">
                    {s.movieTitle}
                  </div>
                </div>

                {/* SALON + SEATS + BUTTONS (left aligned + pushed inward) */}
                <div className="justify-self-start pl-6">
                  <div className="font-semibold text-accent">
                    {/* === NY LOGIK: Kopplat till theaterName === */}
                    Salong {s.theaterName}
                    {/* ========================================= */}

                  </div>
                  <div className="text-sm text-accent/70">
                    Platser -
                    {/* === NY LOGIK: Kopplat till avaliableSeats === */}
                    <span className="text-accent">{s.avaliableSeats} platser kvar</span>
                    {/* ============================================ */}

                  </div>

                  <div className="mt-3 flex gap-2">
                    <button className="rounded-full bg-white/10 px-4 py-1.5 text-sm font-semibold text-accent transition hover:bg-white/20">
                      <Link to={`/test/${s.id}`} >Boka nu</Link>
                    </button>
                    <button className="rounded-full bg-white/10 px-4 py-1.5 text-sm font-semibold text-accent transition hover:bg-white/20">
                      Mer info
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