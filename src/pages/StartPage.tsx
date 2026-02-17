import { useEffect, useState } from "react";
import fetchJson from "../utils/fetchJson";
import MovieCarousel from "../partials/MovieCarousel";

function StartPage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Vi anropar backend för att hämta filmer
    fetchJson("/api/movies")
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
    <div className="flex-grow flex flex-col items-center bg-[#1a1a1a] text-white">
      
      {/* Karusellen högst upp  */}
      <section className="w-full mt-6">
        <MovieCarousel />
      </section>

      {/* Schema-rutan från  Figma-design */}
      <div className="w-[min(900px,calc(100%-32px))] bg-[#332f2e] rounded-[40px] p-10 shadow-2xl mb-20 border border-white/5">
        <h2 className="text-[#c0a060] text-2xl font-light tracking-[0.2em] mb-8 uppercase">
          På bio denna veckan
        </h2>
        
        <div className="space-y-4 border-t border-white/5 pt-6">
           {data ? (
             <p className="text-white/60 font-light">
               Välkommen! Vi har {data.length} spännande filmer på schemat.
             </p>
           ) : (
             <p className="text-white/40 italic font-light">
               Kunde inte ladda schemat just nu.
             </p>
           )}
        </div>
      </div>

    </div>
  );
}

// ROUTE INSTÄLLNINGAR
StartPage.route = {
  path: "/",
   // Ingen menuLabel så den inte syns i menyn
  hideInMenu: true,
  index: -1
};

export default StartPage;