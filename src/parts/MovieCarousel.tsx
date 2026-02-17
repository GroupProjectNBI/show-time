import { useState } from "react";

const MovieCarousel = () => {
  // Design-data (Senare ersätter vi detta med fetch-data)
  const placeholderMovies = [
    { id: 1, title: "Joker", img: "https://image.tmdb.org/t/p/w500/udDcl707OTZdb09j3ndCc7qrC1Q.jpg" },
    { id: 2, title: "Jaws", img: "https://image.tmdb.org/t/p/w500/o7v9Xie7ofJ1U669Sso796V9Y9z.jpg" },
    { id: 3, title: "LotR", img: "https://image.tmdb.org/t/p/w500/6oomZNVXvHaR6Z0BsPb3p6vH1C9.jpg" },
    { id: 4, title: "Inception", img: "https://image.tmdb.org/t/p/w500/edv5CZvRjS99vO6YwoHQzDzpRvt.jpg" },
    { id: 5, title: "Interstellar", img: "https://image.tmdb.org/t/p/w500/gEU2QniE6EwfV4fsSuhghls7h2G.jpg" }
  ];

  const [currentIndex, setCurrentIndex] = useState(0);

  const next = () => setCurrentIndex((prev) => (prev + 1) % placeholderMovies.length);
  const prev = () => setCurrentIndex((prev) => (prev - 1 + placeholderMovies.length) % placeholderMovies.length);

  return (
    <div className="relative w-full max-w-5xl mx-auto px-4 group">
      {/* Film-visaren */}
      <div className="flex justify-center items-center gap-4 sm:gap-10 overflow-hidden py-10">
        {[-1, 0, 1].map((offset) => {
          const index = (currentIndex + offset + placeholderMovies.length) % placeholderMovies.length;
          const isCenter = offset === 0;

          return (
            <div
              key={placeholderMovies[index].id}
              className={`transition-all duration-700 ease-in-out transform rounded-2xl shadow-2xl 
                ${isCenter ? "scale-110 z-10 opacity-100 border-2 border-[#c0a060]/30" : "scale-90 opacity-30 blur-[2px]"}
              `}
            >
              <img
                src={placeholderMovies[index].img}
                alt={placeholderMovies[index].title}
                className="w-48 h-72 sm:w-64 sm:h-96 object-cover rounded-xl"
              />
            </div>
          );
        })}
      </div>

      {/* Diskreta Pilar (Använder text-tecken för att slippa rött streck) */}
      <button
        onClick={prev}
        className="absolute left-0 top-1/2 -translate-y-1/2 text-5xl font-thin text-white/20 hover:text-[#c0a060] transition-colors px-4 focus:outline-none"
      >
        ‹
      </button>

      <button
        onClick={next}
        className="absolute right-0 top-1/2 -translate-y-1/2 text-5xl font-thin text-white/20 hover:text-[#c0a060] transition-colors px-4 focus:outline-none"
      >
        ›
      </button>

      {/* Indikator-streck */}
      <div className="flex justify-center gap-3 mt-2">
        {placeholderMovies.map((_, i) => (
          <div 
            key={i} 
            className={`h-1 transition-all duration-500 rounded-full ${i === currentIndex ? "w-10 bg-[#c0a060]" : "w-2 bg-white/10"}`}
          />
        ))}
      </div>
    </div>
  );
};

export default MovieCarousel;