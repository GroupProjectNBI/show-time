import { Calendar, Clock, MapPin, Ticket, Armchair, QrCode, X } from "lucide-react";

type UpcomingBookingCardProps = {
  title: string;
  dateLabel: string;
  timeLabel: string;
  theaterLabel: string;
  seatsLabel?: string;
  ticketsLabel?: string;
  posterUrl?: string;

  // Actions för senare kanske 
  onViewTicket?: () => void; // Öppna QR-kod 
  onCancel?: () => void; // Anropa cancelbooking(id()


  cancelDisabled?: boolean; // Låsa avbokning nära start
};

export default function UpcomingBookingCard({
  title,
  dateLabel,
  timeLabel,
  theaterLabel,
  seatsLabel,
  ticketsLabel,
  posterUrl,
  onViewTicket,
  onCancel,
  cancelDisabled,
}: UpcomingBookingCardProps) {
  return ( //Kort-container med vårt tema
    <article className="overflow-hidden rounded-2xl bg-white/5 ring-1 ring-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.35)] transition hover:bg-white/10 hover:ring-white/20">
      <div className="grid grid-cols-1 gap-4 p-4 sm:grid-cols-[140px_1fr] sm:gap-6 sm:p-5">
        {/* Poster: om posterUrl saknas visas placeholder,så UI inte “kraschar” visuellt */}
        <div className="overflow-hidden rounded-xl bg-black/20">
          {posterUrl ? (
            <img
              src={posterUrl}
              alt={title}
              loading="lazy"
              className="h-44 w-full object-cover sm:h-full"
            />
          ) : (
            <div className="flex h-44 w-full items-center justify-center text-sm text-white/40 sm:h-full">
              Poster saknas
            </div>
          )}
        </div>

        {/* Content */}
        <div className="min-w-0">
          <div className="flex items-start justify-between gap-3">
            {/* trunkering så långa titlar inte spränger layouten */}
            <h3 className="truncate text-lg font-semibold text-accent sm:text-xl">
              {title}
            </h3>

            {/* liten “badge” */}
            <span className="shrink-0 rounded-full bg-primary px-3 py-1 text-xs font-semibold text-white ring-1 ring-primary/40">
              Kommande
            </span>
          </div>

          {/* Information om bokningen - för att hålla spacing finare i mobil och desktop */}
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

            {/* Renderas bara om ticketsLabel finns, komponenten anpassar sig automatiskt */}
            {ticketsLabel && (
              <div className="flex items-center gap-2">
                <Ticket size={16} className="text-accent/70" />
                <span className="truncate">{ticketsLabel}</span>
              </div>
            )}

            {/* Renderas bara om seatsLabel finns */}
            {seatsLabel && (
              <div className="flex items-center gap-2">
                <Armchair size={16} className="text-accent/70" />
                <span className="truncate">Platser: {seatsLabel}</span>
              </div>
            )}
          </div>

          {/* Actions */}
          {(onViewTicket || onCancel) && (
            <div className="mt-4 flex flex-col gap-2 sm:flex-row sm:items-center">
              {onViewTicket && (
                <button
                  type="button"
                  onClick={onViewTicket}
                  className="inline-flex items-center justify-center gap-2 rounded-full bg-primary px-4 py-2 text-sm font-semibold text-accent transition hover:opacity-90"
                >
                  <QrCode size={16} />
                  Visa biljett
                </button>
              )}

              {onCancel && (
                <button
                  type="button"
                  onClick={onCancel}
                  disabled={cancelDisabled}
                  className="
                  inline-flex items-center justify-center gap-2
                  rounded-full
                  border border-red-500
                  text-red-400
                  px-4 py-2 text-sm font-semibold
                  hover:bg-red-600 hover:text-white
                  transition
                  disabled:cursor-not-allowed disabled:opacity-50
                "
                >
                  <X size={16} />
                  Avboka
                </button>
              )}

            </div>
          )}
        </div>
      </div>

      {/* subtil bottenlinje följer vårt tema*/}
      <div className="h-1 w-full bg-gradient-to-r from-transparent via-white/10 to-transparent" />
    </article>
  );
}
