import type { Screening } from "../interfaces/Screenings";

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
                  KL. {s.time}
                </div>

                <div className="flex items-center gap-4">
                  <div className="h-20 w-14 shrink-0 overflow-hidden rounded-md bg-black/30" />
                  <div className="text-base font-semibold text-accent">
                    {s.movieTitle}
                  </div>
                </div>

                <div>
                  <div className="font-semibold text-accent">
                    Salong {s.salon}
                  </div>
                  <div className="text-sm text-accent/70">
                    Platser - kvar {/*EJ FÄRDIGT LOGIK FÖR PLATSER MÅSTE IN*/}
                  </div>

                  <div className="mt-3 flex flex-wrap gap-2">
                    <button className="rounded-full bg-white/10 px-4 py-1.5 text-sm font-semibold text-accent transition hover:bg-white/20">
                      Boka nu
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
                <div className="text-accent/70">KL. {s.time}</div>

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
                    Salong {s.salon}
                  </div>
                  <div className="text-sm text-accent/70">
                    Platser - kvar {/*EJ FÄRDIGT LOGIK FÖR PLATSER MÅSTE IN*/}
                  </div>

                  <div className="mt-3 flex gap-2">
                    <button className="rounded-full bg-white/10 px-4 py-1.5 text-sm font-semibold text-accent transition hover:bg-white/20">
                      Boka nu
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