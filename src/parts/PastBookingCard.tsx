import { useState } from "react";
import {
  Calendar,
  Clock,
  MapPin,
  Ticket,
  Armchair,
  CheckCircle2,
  ChevronDown,
  Star,
} from "lucide-react";

type PastBookingItem = {
  id: number;
  movieId: number;
  title: string;
  dateLabel: string;
  timeLabel: string;
  theaterLabel: string;
  seatsLabel?: string;
  ticketsLabel?: string;
  seenLabel: string;
  userRating?: number;
};

type PastBookingCardProps = {
  bookings: PastBookingItem[];
  // Uppdaterad: Tar nu även emot description
  onRateMovie?: (bookingId: number, movieId: number, rating: number, description: string) => void;
};

export default function PastBookingCard({ bookings, onRateMovie }: PastBookingCardProps) {
  const [open, setOpen] = useState(false);

  // Håller koll på klickade stjärnor (innan de sparas)
  const [activeRatings, setActiveRatings] = useState<Record<number, number>>({});
  // Håller koll på vad användaren skriver i textrutan
  const [reviewTexts, setReviewTexts] = useState<Record<number, string>>({});

  const handleStarClick = (bookingId: number, star: number) => {
    setActiveRatings((prev) => ({ ...prev, [bookingId]: star }));
  };

  const handleSave = (bookingId: number, movieId: number) => {
    const rating = activeRatings[bookingId] || 0;
    const text = reviewTexts[bookingId] || "";
    if (onRateMovie) {
      onRateMovie(bookingId, movieId, rating, text);
    }
  };

  return (
    <section className="overflow-hidden rounded-2xl bg-white/5 shadow-[0_20px_50px_rgba(0,0,0,0.35)] transition">
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className="flex w-full items-center justify-between gap-4 px-4 py-4 text-left transition hover:bg-white/10 sm:px-5"
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
          {bookings.map((booking, index) => {
            const isRatingActive = activeRatings[booking.id] > 0 && !booking.userRating;
            const displayRating = booking.userRating || activeRatings[booking.id] || 0;

            return (
              <div key={booking.id}>
                <article className="px-4 py-4 sm:px-5 flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                  {/* Vänster sida: Info */}
                  <div className="flex-1">
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
                  </div>

                  {/* Höger sida: Betygsystem (Review) */}
                  <div className="shrink-0 sm:text-right mt-2 sm:mt-0 flex flex-col sm:items-end bg-black/20 p-3 rounded-xl border border-white/5">
                    <span className="text-xs uppercase tracking-wider text-accent/60 mb-1 font-bold">
                      {booking.userRating ? "Ditt betyg" : "Lämna omdöme"}
                    </span>

                    {/* Stjärnorna */}
                    <div className="flex items-center gap-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          disabled={!!booking.userRating} // Lås om redan betygsatt
                          onClick={() => handleStarClick(booking.id, star)}
                          className={`transition ${!booking.userRating && "hover:scale-110"} ${displayRating >= star
                            ? "text-yellow-400"
                            : "text-white/20 hover:text-yellow-400/50"
                            }`}
                        >
                          <Star
                            size={24}
                            fill={displayRating >= star ? "currentColor" : "none"}
                          />
                        </button>
                      ))}
                    </div>

                    {/* Dold textruta som fälls ut när man klickar på en stjärna */}
                    {isRatingActive && (
                      <div className="mt-3 flex flex-col gap-2 items-end w-full sm:w-48 animate-in fade-in slide-in-from-top-2 duration-300">
                        <textarea
                          rows={2}
                          maxLength={250}
                          placeholder="Kort kommentar (valfritt)"
                          className="w-full text-xs bg-white/5 border border-white/10 rounded-lg p-2 text-white placeholder:text-white/30 resize-none focus:outline-none focus:border-accent/50"
                          value={reviewTexts[booking.id] || ""}
                          onChange={(e) =>
                            setReviewTexts((prev) => ({ ...prev, [booking.id]: e.target.value }))
                          }
                        />
                        <button
                          onClick={() => handleSave(booking.id, booking.movieId)}
                          className="bg-accent text-black text-xs font-bold uppercase tracking-wider px-3 py-1.5 rounded-lg hover:bg-accent/80 transition w-full sm:w-auto"
                        >
                          Spara
                        </button>
                      </div>
                    )}
                  </div>
                </article>

                {index < bookings.length - 1 && (
                  <div className="mx-4 h-px bg-white/10 sm:mx-5" />
                )}
              </div>
            );
          })}
        </div>
      )}

      <div className="h-1 w-full bg-gradient-to-r from-transparent via-white/10 to-transparent" />
    </section>
  );
}