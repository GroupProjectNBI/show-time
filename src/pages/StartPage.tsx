import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom"; // För att kunna skicka användaren till bokningen
import fetchJson from "../utils/fetchJson";
import { formatTime } from "../utils/formatTime"; 
import MovieCarousel from "../parts/MovieCarousel";

//Interface-tänket
interface Screening {
    screeningId: number;
    date: string;
    startTime: string;
}
interface Movie {
    movieId: number;
    title: string;
    screenings: Screening[];
}

function StartPage() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedScreening, setSelectedScreening] = useState<any>(null);
  const navigate = useNavigate();
  

useEffect(() => {
const getMovies = async () => {
try {
// Vi hämtar filmer och deras visningar
const result = await fetchJson("/api/v_getMovieDetailsView"); 
if (result) setMovies(result);
} catch (error) {
console.error("Fel vid hämtning av filmer:", error);
} finally {
setLoading(false);
 }
 };
getMovies();
    }, []);

  const handleBooking = () => {
    if (selectedScreening) {
// Skickar användaren till bokningssidan med rätt ID:n
navigate(`/booking/${selectedScreening.movieId}/${selectedScreening.id}`);
    }
  };

 if (loading) return <div className="min-h-screen bg-[#1a1a1a] text-accent flex items-center justify-center uppercase tracking-widest">Laddar...</div>;

    return (
<div className="flex-grow flex flex-col items-center bg-[#1a1a1a] text-white font-light pb-10">

{/* 1. Karusellen sektion  (Prickarna syns bättre med mindre marginal)*/}
<section className="w-full mt-4 mb-2">        
  <MovieCarousel />
      </section>

{/* 2. Schema-sektion (Den kompakta kalendern) från  Figma-design (den bruna rutan med guld-text och logic för tider) */}
<div className="w-[min(850px,calc(100%-32px))] bg-[#332f2e] rounded-[30px] p-6 shadow-2xl mb-8 border border-white/5">
<h2 className="text-accent text-lg tracking-[0.2em] mb-6 uppercase font-normal">
  På bio denna veckan
   </h2>
            
<div className="space-y-4">
 {movies.slice(0, 2).map((movie) => (
 <div key={movie.movieId} className="grid grid-cols-[1fr_auto] items-center gap-4 bg-black/20 p-4 rounded-xl border border-white/5">
    <div>
  <h3 className="text-md font-normal uppercase tracking-wider text-white">{movie.title}</h3>
  <p className="text-xs text-white/40 uppercase mt-1">Visningar idag:</p>
     </div>
            
{/* Visningstiderna ..Här läggs tiderna till dynamiskt*/}
<div className="flex gap-2">
{movie.screenings?.slice(0, 3).map((s) => (                    
<button
key={s.screeningId}
onClick={() => setSelectedScreening({ movieId: movie.movieId, screeningId: s.screeningId })}                      
className={`flex flex-col items-center min-w-[60px] py-2 rounded-lg transition-all border ${ 
selectedScreening?.screeningId === s.screeningId                       
? "bg-primary border-primary text-white shadow-lg scale-105"
: "bg-[#C6A96A]/10 border-[#C6A96A]/20 text-accent hover:bg-[#C6A96A]/20"
  }`}   
>
<span className="text-sm font-bold">{formatTime(s.startTime)}</span>
<span className="text-[10px] opacity-60 uppercase">{s.date.split('-')[2]}/{s.date.split('-')[1]}</span>
  </button>
                  ))}
                </div>
              </div>
            ))}
        </div>
{/* 3. Boka-sektionen flyttad neråt höger för att ge plats åt Kiosken nedanför */}
<div className="mt-8 flex justify-end items-center gap-6">
{!selectedScreening && (
<p className="text-accent/40 text-[10px] uppercase tracking-widest italic animate-pulse">Välj en visning för att boka</p>
  )}
<button
onClick={handleBooking}
disabled={!selectedScreening}
className={`px-12 py-3 rounded-lg text-xs font-bold uppercase tracking-[0.2em] transition-all shadow-xl ${
selectedScreening 
? "bg-primary text-white hover:bg-red-700 hover:scale-105"                
: "bg-white/5 text-white/20 cursor-not-allowedborder border-white/10"
 }`}
>
 Boka nu
</button>
  </div>
     </div>
{/* Här lämnar vi plats för Kiosken */}
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