import { useEffect, useState } from "react";
import fetchJson from "../utils/fetchJson";
import OfferBanner from "../parts/OfferBanner";

// IMPORTERA BÅDA KARUSELLERNA
import MovieCarousel3D from "../parts/MovieCarousel3D";
import MovieCarouselFlat from "../parts/MovieCarouselFlat";

function StartPage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const standardWidth = "w-[min(1200px,calc(100%-32px))]";

  useEffect(() => {
    fetchJson("/api/v_getPopular")
      .then((json) => {
        setData(json);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Fetch failed:", err);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="flex-grow flex items-center justify-center text-white bg-[#1a1a1a]">
        <p className="animate-pulse font-light tracking-widest">Hämtar bio-magi...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center bg-[#1a1a1a] text-white pb-40 pt-6 relative overflow-x-hidden">

      {/* --- BAKGRUNDS-EFFEKT (Spotlight) --- */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[600px] bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-[#680909]/30 via-[#1a1a1a]/80 to-[#1a1a1a] pointer-events-none z-0" />

      {/* =======================================================
          ALTERNATIV 1: DEN NYA 3D-KARUSELLEN
         ======================================================= */}
      <div className="w-full text-center mt-4 mb-2 z-20">
        <span className="bg-white/10 text-xs px-3 py-1 rounded-full uppercase tracking-wider text-white/50">Alternativ 1: 3D Stack</span>
      </div>

      <section className={`${standardWidth} mx-auto mb-16 z-10`}>
        <MovieCarousel3D popularMovie={data} />
      </section>


      {/* =======================================================
          ALTERNATIV 2: DEN GAMLA PLATTA KARUSELLEN
         ======================================================= */}
      <div className="w-full border-t border-white/10 my-10" /> {/* En linje emellan */}

      <div className="w-full text-center mb-6 z-20">
        <span className="bg-white/10 text-xs px-3 py-1 rounded-full uppercase tracking-wider text-white/50">Alternativ 2: Standard Platt</span>
      </div>

      <section className={`${standardWidth} mx-auto mb-16 z-10`}>
        <MovieCarouselFlat popularMovie={data} />
      </section>

      {/* =======================================================
          ÖVRIGT INNEHÅLL
         ======================================================= */}

      {/* SCHEMA-RUTAN */}
      <div className={`${standardWidth} mx-auto bg-surface rounded-[40px] p-10 shadow-2xl mb-16 border border-white/5 z-10 relative`}>
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-white/5 to-transparent rounded-[40px] pointer-events-none" />

        <h2 className="text-[#c0a060] text-2xl font-light tracking-[0.2em] mb-8 uppercase border-b border-white/5 pb-4 relative z-20">
          På bio denna veckan
        </h2>

        <div className="space-y-4 relative z-20">
          {data ? (
            <p className="text-white/70 font-light text-lg leading-relaxed">
              Välkommen! Just nu visar vi <span className="text-white font-bold">{data.length}</span> titlar som toppar listorna. Boka din favoritplats redan idag.
            </p>
          ) : (
            <p className="text-white/40 italic font-light">
              Kunde inte ladda schemat just nu.
            </p>
          )}
        </div>
      </div>

      {/* OFFER BANNER */}
      <div className={`${standardWidth} mx-auto mb-10 z-10`}>
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
// skuggning på den äldre. .. 
// nya : dra ut de andra posters lite mer så de syns mer. Och ge det mer spotlight 
export default StartPage;