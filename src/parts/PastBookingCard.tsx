import { Calendar, Clock, MapPin, Ticket, Armchair, CheckCircle2 } from "lucide-react";

type HistoricalBookingCardProps = {
  title: string;
  dateLabel: string;
  timeLabel: string;

  // NYTT: movieId behövs för att kunna visa rätt poster
  movieId: number;

  theaterLabel: string;
  seatsLabel?: string;
  ticketsLabel?: string;

  // posterUrl tas bort eftersom vi bygger poster-path från movieId
  // posterUrl?: string;

  // Info om när filmen sågs
  seenLabel: string;
};

export default function HistoricalBookingCard({
  title,
  dateLabel,
  timeLabel,
  movieId, // NYTT: tar emot movieId
  theaterLabel,
  seatsLabel,
  ticketsLabel,
  seenLabel,

}: HistoricalBookingCardProps) {
  return (
    <article
      className="
        overflow-hidden rounded-2xl
        bg-white/3 opacity 85
        shadow-[0_20px_50px_rgba(0,0,0,0.35)]
        transition
      "
    >
      <div className="grid grid-cols-1 gap-4 p-4 sm:grid-cols-[140px_1fr] sm:gap-6 sm:p-5">
        {/* Poster */}
        {/* NYTT: Vi hämtar postern baserat på movieId istället för posterUrl */}
        <div className="overflow-hidden rounded-xl bg-black/20">
          <img
            src={`/images/posters/${movieId}.webp`} // NYTT
            alt={title}
            loading="lazy"
            className="h-44 w-full object-cover sm:h-full"
            onError={(e) => {
              e.currentTarget.style.display = "none";
              const next = e.currentTarget.nextElementSibling as HTMLElement | null;
              if (next) next.style.display = "flex";
            }}
          />

          {/* placeholder visas om poster saknas */}
          <div className="hidden h-44 w-full items-center justify-center text-sm text-white/40 sm:h-full">
            Poster saknas
          </div>
        </div>

        {/* Content */}
        <div className="min-w-0">
          <div className="flex items-start justify-between gap-3">
            <h3 className="truncate text-lg font-semibold text-accent sm:text-xl">
              {title}
            </h3>

            {/* Checkbox för "sedd" */}
            <span className=" 
              flex items-center gap-1
              shrink-0 rounded-full
              bg-white/10
              px-3 py-1
              text-xs font-semibold
              text-accent/70
              ring-1 ring-white/15
            ">
              Sedd
              <CheckCircle2 size={14} className="text-accent/50" />
            </span>

          </div>

          {/* "Sågs detalj */}
          <div className="mt-2 flex items-center gap-2 text-sm text-accent/70">
            <CheckCircle2 size={16} className="text-accent/60" />
            <span className="truncate">{seenLabel}</span>
          </div>

          {/* Informations-grid */}
          <div className="mt-3 grid grid-cols-1 gap-2 text-sm text-accent/80 sm:grid-cols-2">
            <div className="flex items-center gap-2">
              <Calendar size={16} className="text-accent/70" />
              <span className="truncate">{dateLabel}</span>
            </div>

            <div className="flex items-center gap-2">
              <Clock size={16} className="text-accent/70" />
              <span className="truncate">{timeLabel}</span>
            </div>

            <div className="flex items-center gap-2 sm:col-span-2">
              <MapPin size={16} className="text-accent/70" />
              <span className="truncate">{theaterLabel}</span>
            </div>

            {ticketsLabel && (
              <div className="flex items-center gap-2">
                <Ticket size={16} className="text-accent/70" />
                <span className="truncate">{ticketsLabel}</span>
              </div>
            )}

            {seatsLabel && (
              <div className="flex items-center gap-2">
                <Armchair size={16} className="text-accent/70" />
                <span className="truncate">Platser: {seatsLabel}</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Subtil bottenlinje som upcoming (lite mer dämpad) */}
      <div className="h-1 w-full bg-gradient-to-r from-transparent via-white/8 to-transparent" />
    </article>
  );
}