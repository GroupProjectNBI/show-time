import { useState } from "react";
import {
  Calendar,
  Clock,
  MapPin,
  Ticket,
  Armchair,
  CheckCircle2,
  ChevronDown,
} from "lucide-react";

type PastBookingItem = {
  id: number;
  title: string;
  dateLabel: string;
  timeLabel: string;
  theaterLabel: string;
  seatsLabel?: string;
  ticketsLabel?: string;
  seenLabel: string;
};

type PastBookingCardProps = {
  bookings: PastBookingItem[];
};

export default function PastBookingCard({ bookings }: PastBookingCardProps) {
  const [open, setOpen] = useState(false);

  return (
    <section
      className="
        overflow-hidden rounded-2xl
        bg-white/3
        shadow-[0_20px_50px_rgba(0,0,0,0.35)]
        transition
      "
    >
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className="
          flex w-full items-center justify-between gap-4
          px-4 py-4 text-left
          transition hover:bg-white/5
          sm:px-5
        "
      >
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <CheckCircle2 size={18} className="shrink-0 text-accent/70" />
            <h3 className="text-base font-semibold text-accent sm:text-lg">
              Tidigare sedda filmer
            </h3>
          </div>

          <p className="mt-1 text-sm text-accent/60">
            {bookings.length} {bookings.length === 1 ? "film" : "filmer"}
          </p>
        </div>

        <ChevronDown
          size={20}
          className={`shrink-0 text-accent/70 transition-transform duration-200 ${open ? "rotate-180" : ""
            }`}
        />
      </button>

      {open && (
        <div className="border-t border-white/10">
          {bookings.map((booking, index) => (
            <div key={booking.id}>
              <article className="px-4 py-4 sm:px-5">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <h4 className="truncate text-lg font-semibold text-accent sm:text-xl">
                      {booking.title}
                    </h4>

                    <div className="mt-2 flex items-center gap-2 text-sm text-accent/70">
                      <CheckCircle2 size={16} className="shrink-0 text-accent/60" />
                      <span className="truncate">{booking.seenLabel}</span>
                    </div>
                  </div>

                  <span
                    className="
                      shrink-0 rounded-full
                      bg-white/10 px-3 py-1
                      text-xs font-semibold text-accent/70
                      ring-1 ring-white/15
                    "
                  >
                    Sedd
                  </span>
                </div>

                <div className="mt-3 grid grid-cols-1 gap-2 text-sm text-accent/80 sm:grid-cols-2">
                  <div className="flex items-center gap-2">
                    <Calendar size={16} className="shrink-0 text-accent/70" />
                    <span className="truncate">{booking.dateLabel}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <Clock size={16} className="shrink-0 text-accent/70" />
                    <span className="truncate">{booking.timeLabel}</span>
                  </div>

                  <div className="flex items-center gap-2 sm:col-span-2">
                    <MapPin size={16} className="shrink-0 text-accent/70" />
                    <span className="truncate">{booking.theaterLabel}</span>
                  </div>

                  {booking.ticketsLabel && (
                    <div className="flex items-center gap-2">
                      <Ticket size={16} className="shrink-0 text-accent/70" />
                      <span className="truncate">{booking.ticketsLabel}</span>
                    </div>
                  )}

                  {booking.seatsLabel && (
                    <div className="flex items-center gap-2">
                      <Armchair size={16} className="shrink-0 text-accent/70" />
                      <span className="truncate">Platser: {booking.seatsLabel}</span>
                    </div>
                  )}
                </div>
              </article>

              {index < bookings.length - 1 && (
                <div className="mx-4 h-px bg-white/10 sm:mx-5" />
              )}
            </div>
          ))}
        </div>
      )}

      <div className="h-1 w-full bg-gradient-to-r from-transparent via-white/8 to-transparent" />
    </section>
  );
}