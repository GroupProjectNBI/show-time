type MovieCardProps = {
  title: string;
  genre: string;
  ageLimit: string;        // "15+"
  dateTimeLabel: string;   // "Tisdag 5 februari, 17:00"
  theaterLabel: string;    // "Stora Salongen"
  posterUrl?: string;
};
import Image from "./Image";

export default function MovieCard({
  title,
  genre,
  ageLimit,
  dateTimeLabel,
  theaterLabel,
  posterUrl,
}: MovieCardProps) {
  return (
    <div className="w-full max-w-4xl">
      {/* Ingen border/ram */}
      <div className="rounded-2xl bg-[#1a1a1a] shadow-[0_20px_50px_rgba(0,0,0,0.35)] overflow-hidden">
        <div className="flex flex-col sm:flex-row sm:gap-10">
          {/* Poster */}
          <div className="sm:shrink-0 sm:p-6 p-5">
            {posterUrl ? (
              <Image
                src={posterUrl}
                alt={title}
                loading="lazy"
                className="
                  w-full sm:w-[210px]
                  aspect-[2/3]
                  object-cover
                  rounded-xl
                  shadow-[0_12px_35px_rgba(0,0,0,0.55)]
                "
              />
            ) : (
              <div
                className="
                  w-full sm:w-[210px]
                  aspect-[2/3]
                  rounded-xl
                  bg-white/5
                  flex items-center justify-center
                  text-white/40 text-sm
                "
              >
                Poster saknas
              </div>
            )}
          </div>

          {/* Text */}
          <div className="px-5 pb-6 sm:px-0 sm:pr-6 sm:py-6">
            <div className="sm:pt-2">
              {/* Titel */}
              <h1 className="text-accent text-2xl sm:text-[28px] font-semibold leading-tight">
                {title}
              </h1>

              {/* Genre + ålder */}
              <div className="mt-1 text-accent/80 text-xs sm:text-[13px] font-medium">
                {genre} {ageLimit}
              </div>

              {/* Flytta ner datum/tid + salong + text längre ner */}
              <div className="mt-8 sm:mt-10">
                <div className="text-accent text-xl sm:text-[22px] font-semibold">
                  {dateTimeLabel}
                </div>

                <div className="mt-1 text-accent/70 text-xs sm:text-[13px]">
                  {theaterLabel}
                </div>

                <p className="mt-4 text-accent/80 text-sm">
                  Välj och boka nedanför.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* subtil bottenlinje kan vara kvar eller tas bort */}
        <div className="h-1 w-full bg-gradient-to-r from-transparent via-white/10 to-transparent" />
      </div>
    </div>
  );
}
