import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom"; // För att kunna skicka användaren till bokningen
import fetchJson from "../utils/fetchJson";
import MovieCarousel from "../parts/MovieCarousel";

function StartPage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [selectedScreening, setSelectedScreening] = useState<any>(null);
  const navigate = useNavigate();
  

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

  const handleBooking = () => {
    if (selectedScreening) {
      // Skickar användaren till bokningssidan med rätt ID:n
      navigate(`/booking/${selectedScreening.movieId}/${selectedScreening.id}`);
    }
  };



  if (loading) {
    return (
      <div className="flex-grow flex items-center justify-center text-white bg-[#1a1a1a]">
        <p className="animate-pulse font-light tracking-widest">Hämtar bio-magi...</p>
      </div>
    );
  }

  return (
    <div className="flex-grow flex flex-col items-center bg-[#1a1a1a] text-white">
      
      {/* 1. Karusellen sektion  */}
      <section className="w-full mt-6">
        <MovieCarousel />
      </section>

      {/* 2. Schema-rutan från  Figma-design */}
<div className="w-[min(900px,calc(100%-32px))] bg-[#332f2e] rounded-[40px] p-10 shadow-2xl mb-20 border border-white/5 font-light"> 

<h2 className="text-[#c0a060] text-2xl font-light tracking-[0.2em] mb-8 uppercase">
            </h2>
            På bio denna veckan
        
<div className="space-y-8 border-t border-white/5 pt-8">
          {data && data.length > 0 ? (
            // Om vi har filmer, loopa ut dem här
            data.slice(0, 4).map((movie: any) => (
              <div key={movie.id} className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/5 pb-6 last:border-0">
                <div>
                  <h3 className="text-xl font-normal tracking-[0.1em] uppercase">{movie.title}</h3>
                  <p className="text-white/40 text-sm italic">{movie.genre || "Drama"} • {movie.length || "120"} min</p>
                </div>

                {/* Knapparna för tider */}
                <div className="flex flex-wrap gap-3">
                  {movie.screenings?.map((screening: any) => (
                    <button
                      key={screening.id}
                      onClick={() => setSelectedScreening({ ...screening, movieId: movie.id })}
                      className={`px-4 py-2 rounded-lg border transition-all duration-300 text-sm tracking-widest ${
                        selectedScreening?.id === screening.id
                          ? "bg-[#c0a060] border-[#c0a060] text-[#1a1a1a] font-bold shadow-lg scale-105"
                          : "border-white/10 hover:border-[#c0a060]/50 text-white/80"
                      }`}
                    >
                      {screening.time}
                    </button>
                  ))}
                </div>
              </div>
            ))
          ) : (
            // Om ingen data finns (det du ser i din bild just nu)
            <div className="py-10 text-center">
              <p className="text-white/40 italic tracking-widest">Inga filmer hittades i systemet.</p>
            </div>
          )}
        </div>

        {/* 3. Boka-knapp (Längst ner i rutan) */}
        <div className="mt-12 flex flex-col items-center gap-4">
          <button
            onClick={handleBooking}
            disabled={!selectedScreening}
            className={`px-16 py-4 rounded-full font-bold uppercase tracking-[0.2em] transition-all duration-500 shadow-2xl ${
              selectedScreening 
                ? "bg-[#e50914] text-white hover:bg-[#ff0000] hover:scale-105" 
                : "bg-white/5 text-white/20 cursor-not-allowed"
            }`}
          >
            Boka nu
          </button>
                  {/* 3. Boka-knapp (Längst ner i rutan) */}
        <div className="mt-12 flex flex-col items-center gap-4">
          <button
            onClick={handleBooking}
            disabled={!selectedScreening}
            className={`px-16 py-4 rounded-full font-bold uppercase tracking-[0.2em] transition-all duration-500 shadow-2xl ${
              selectedScreening 
                ? "bg-[#e50914] text-white hover:bg-[#ff0000] hover:scale-105" 
                : "bg-white/5 text-white/20 cursor-not-allowed"
            }`}
          >
            Boka nu
          </button>
          {!selectedScreening && (
            <p className="text-[#c0a060]/50 text-xs uppercase tracking-[0.1em]">Välj en tid för att fortsätta</p>
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
