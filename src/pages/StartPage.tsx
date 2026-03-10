import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import fetchJson from "../utils/fetchJson";
import { formatTime } from "../utils/formatTime";
import OfferBanner from "../parts/OfferBanner";

// IMPORTERA DINA KARUSELLER
import MovieCarousel3D from "../parts/MovieCarousel3D";
import MovieCarouselFlat from "../parts/MovieCarouselFlat";

function StartPage() {
  const [popularData, setPopularData] = useState<any>(null); // För karusellerna
  const [moviesWithScreenings, setMoviesWithScreenings] = useState<any[]>([]); // För schemat
  const [loading, setLoading] = useState(true);
  const [selectedScreening, setSelectedScreening] = useState<any>(null);
  const navigate = useNavigate();

  const standardWidth = "w-[min(1200px,calc(100%-32px))]";

  useEffect(() => {
    const loadAllData = async () => {
      try {
        // 1. Hämta data till karusellerna (gamla fetch)
        const popular = await fetchJson("/api/v_getPopular");
        setPopularData(popular);

        // 2. Hämta data till det interaktiva schemat (gruppmedlemmens fetch)
        const detailed = await fetchJson("/api/v_getMovieDetailsView");
        if (detailed) setMoviesWithScreenings(detailed);

      } catch (error) {
        console.error("Fel vid hämtning av data:", error);
      } finally {
        setLoading(false);
      }
    };

    loadAllData();
  }, []);

  const handleBooking = () => {
    if (selectedScreening) {
      // Navigera till bokningen med valt screeningId
      navigate(`/booking/${selectedScreening.screeningId}`);
    }
  };

  if (loading) {
    return (
      <div className="flex-grow flex items-center justify-center text-white bg-[#1a1a1a]">
        <p className="animate-pulse font-light tracking-widest text-[#c0a060]">Hämtar bio-magi...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center bg-[#1a1a1a] text-white pt-6 relative overflow-x-hidden">

      {/* --- BAKGRUNDS-EFFEKT --- */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[600px] bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-[#680909]/30 via-[#1a1a1a]/80 to-[#1a1a1a] pointer-events-none z-0" />

      {/* --- ALTERNATIV 1: 3D STACK --- */}
      {/* <div className="w-full text-center mt-4 mb-2 z-20">
        <span className="bg-white/5 border border-white/10 text-[10px] px-3 py-1 rounded-full uppercase tracking-[0.2em] text-white/40">
          Alternativ 1: 3D Stack
        </span>
      </div>
      <section className={`${standardWidth} mx-auto mb-16 z-10`}>
        <MovieCarousel3D popularMovie={popularData} />
      </section> */}

      {/* --- SEPARATOR --- */}
      {/* <div className="w-full max-w-4xl border-t border-white/5 my-10 relative z-10" /> */}

      {/* --- ALTERNATIV 2: PLATT KARUSELL --- */}
      {/* <div className="w-full text-center mb-6 z-20">
        <span className="bg-white/5 border border-white/10 text-[10px] px-3 py-1 rounded-full uppercase tracking-[0.2em] text-white/40">
          Alternativ 2: Standard Platt
        </span>
      </div>
      <section className={`${standardWidth} mx-auto mb-24 z-10`}>
        <MovieCarouselFlat popularMovie={popularData} />
      </section> */}

      {/* KARUSELL-SEKTION */}
      <section className={`${standardWidth} mx-auto mb-8 z-10`}>
        {/* 3D Karusell - Visas endast på Desktop (medium skärm och uppåt) */}
        <div className="hidden md:block">
          <MovieCarousel3D popularMovie={popularData} />
        </div>

        {/* Flat Karusell - Visas endast på Mobil (döljs på medium skärm och uppåt) */}
        <div className="md:hidden">
          <MovieCarouselFlat popularMovie={popularData} />
        </div>
      </section>

      {/* --- INTERAKTIVT SCHEMA (Sammanslagen design) --- */}
      <div className={`${standardWidth} mx-auto bg-white/[0.03] backdrop-blur-md rounded-[40px] p-8 md:p-12 shadow-2xl mb-8 border border-white/5 z-10 relative overflow-hidden`}>
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-[#c0a060]/5 to-transparent pointer-events-none" />

        <h2 className="text-[#c0a060] text-2xl font-light tracking-[0.2em] mb-10 uppercase border-b border-white/10 pb-4 relative z-20">
          På bio denna veckan
        </h2>

        {/* Listan med filmer och tider */}
        <div className="space-y-6 relative z-20">
          {moviesWithScreenings.slice(0, 3).map((movie) => (
            <div key={movie.movieId} className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-black/30 p-6 rounded-2xl border border-white/5 hover:border-[#c0a060]/30 transition-colors">
              <div>
                <h3 className="text-xl font-normal uppercase tracking-wider text-white">{movie.title}</h3>
                <p className="text-xs text-[#c0a060]/60 uppercase mt-1 font-bold">Dagens visningar</p>
              </div>

              {/* Tids-knappar */}
              <div className="flex flex-wrap gap-3">
                {movie.screenings?.slice(0, 4).map((s: any) => (
                  <button
                    key={s.screeningId}
                    onClick={() => setSelectedScreening({ movieId: movie.movieId, screeningId: s.screeningId })}
                    className={`flex flex-col items-center min-w-[70px] py-3 rounded-xl transition-all border ${selectedScreening?.screeningId === s.screeningId
                      ? "bg-primary border-primary text-white shadow-[0_0_20px_rgba(239,68,68,0.4)] scale-105"
                      : "bg-white/5 border-white/10 text-white/80 hover:bg-white/10"
                      }`}
                  >
                    <span className="text-sm font-bold">{formatTime(s.startTime)}</span>
                    <span className="text-[10px] opacity-50">{s.date.split('-')[2]}/{s.date.split('-')[1]}</span>
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Bokningsknapp sektion */}
        <div className="mt-12 flex flex-col md:flex-row items-center justify-end gap-6 relative z-20">
          {!selectedScreening && (
            <p className="text-[#c0a060]/40 text-xs uppercase tracking-widest italic animate-pulse">
              Välj en visning för att boka
            </p>
          )}
          <button
            onClick={handleBooking}
            disabled={!selectedScreening}
            className={`px-16 py-4 rounded-xl text-sm font-bold uppercase tracking-[0.2em] transition-all shadow-2xl ${selectedScreening
              ? "bg-primary text-white hover:bg-red-700 hover:scale-105"
              : "bg-white/5 text-white/20 border border-white/10 cursor-not-allowed"
              }`}
          >
            Boka nu
          </button>
        </div>
      </div>

      {/* ERBJUDANDEN */}
      <div className={`${standardWidth} mx-auto mb-2 z-10 transition-transform hover:scale-[1.01] duration-500`}>
        <OfferBanner />
      </div>
    </div>
  );
}

StartPage.route = {
  path: "/",
  hideInMenu: true,
  index: -1
};

export default StartPage;