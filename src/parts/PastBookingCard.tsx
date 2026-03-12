import { Calendar, Clock, MapPin, Ticket, Armchair, CheckCircle2 } from "lucide-react";

type HistoricalBookingCardProps = {
  title: string;
  dateLabel: string;
  timeLabel: string;
  movieId: number;
  theaterLabel: string;
  seatsLabel?: string;
  ticketsLabel?: string;
  seenLabel: string;
};

export default function HistoricalBookingCard({
  title,
  dateLabel,
  timeLabel,
  movieId,
  theaterLabel,
  seatsLabel,
  ticketsLabel,
  seenLabel,
}: HistoricalBookingCardProps) {
  return (
    <article className="overflow-hidden rounded-2xl bg-white/[0.03] shadow-[0_20px_50px_rgba(0,0,0,0.35)] transition hover:bg-white/[0.05]">
      <div className="grid grid-cols-1 gap-4 p-4 sm:grid-cols-[140px_1fr] sm:gap-6 sm:p-5">

        {/* Poster */}
        <div className="overflow-hidden rounded-xl bg-black/20">
          <img
            src={`/images/posters/${movieId}.webp`}
            alt={title}
            loading="lazy"
            className="h-44 w-full object-cover sm:h-full grayscale-[0.3] hover:grayscale-0 transition-all duration-500"
            onError={(e) => {
              e.currentTarget.style.display = "none";
              const next = e.currentTarget.nextElementSibling as HTMLElement | null;
              if (next) next.style.display = "flex";
            }}
          />
          <div className="hidden h-44 w-full items-center justify-center text-sm text-white/40 sm:h-full">
            Poster saknas
          </div>
        </div>

        {/* Content */}
        <div className="min-w-0">
          <div className="flex items-start justify-between gap-3">
            <h3 className="truncate text-lg font-semibold text-accent/80 sm:text-xl">
              {title}
            </h3>

            {/* Status Badge */}
            <span className="flex items-center gap-1 shrink-0 rounded-full bg-white/5 px-3 py-1 text-xs font-semibold text-accent/50 ring-1 ring-white/10">
              Sedd
              <CheckCircle2 size={12} />
            </span>
          </div>

          {/* Informations-grid - Nu helt synkad med UpcomingCard */}
          <div className="mt-4 grid grid-cols-1 gap-y-4 gap-x-2 text-sm text-accent/70 sm:grid-cols-2 items-start">

            {/* Status/Sedd info */}
            <div className="flex items-start gap-2 sm:col-span-2 bg-white/[0.02] p-2 rounded-lg border border-white/5">
              <CheckCircle2 size={16} className="text-accent/40 mt-1 shrink-0" />
              <div className="flex flex-col">
                <span className="text-[10px] uppercase font-bold text-accent/30 tracking-widest mb-0.5">Historik</span>
                <span className="text-accent/60 italic">{seenLabel}</span>
              </div>
            </div>

            {/* Datum */}
            <div className="flex items-start gap-2">
              <Calendar size={16} className="text-accent/40 mt-1 shrink-0" />
              <div className="flex flex-col">
                <span className="text-[10px] uppercase font-bold text-accent/30 tracking-widest mb-0.5">Datum</span>
                <span className="truncate">{dateLabel}</span>
              </div>
            </div>

            {/* Tid */}
            <div className="flex items-start gap-2">
              <Clock size={16} className="text-accent/40 mt-1 shrink-0" />
              <div className="flex flex-col">
                <span className="text-[10px] uppercase font-bold text-accent/30 tracking-widest mb-0.5">Tid</span>
                <span className="truncate">{timeLabel}</span>
              </div>
            </div>

            {/* Salong */}
            <div className="flex items-start gap-2 sm:col-span-2 border-t border-white/5 pt-2">
              <MapPin size={16} className="text-accent/40 mt-1 shrink-0" />
              <div className="flex flex-col">
                <span className="text-[10px] uppercase font-bold text-accent/30 tracking-widest mb-0.5">Salong</span>
                <span className="truncate">{theaterLabel}</span>
              </div>
            </div>

            {/* Biljetter */}
            {ticketsLabel && (
              <div className="flex items-start gap-2">
                <Ticket size={16} className="text-accent/40 mt-1 shrink-0" />
                <div className="flex flex-col">
                  <span className="text-[10px] uppercase font-bold text-accent/30 tracking-widest mb-0.5">Biljetter</span>
                  <span className="truncate">{ticketsLabel}</span>
                </div>
              </div>
            )}

            {/* Platser */}
            {seatsLabel && (
              <div className="flex items-start gap-2">
                <Armchair size={16} className="text-accent/40 mt-1 shrink-0" />
                <div className="flex flex-col">
                  <span className="text-[10px] uppercase font-bold text-accent/30 tracking-widest mb-0.5">Platser</span>
                  <div className="flex flex-col gap-1">
                    {seatsLabel.split("; ").map((seat, index) => (
                      <span key={index} className="text-sm font-medium text-accent/60">
                        {seat}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="h-1 w-full bg-gradient-to-r from-transparent via-white/5 to-transparent" />
    </article>
  );
}