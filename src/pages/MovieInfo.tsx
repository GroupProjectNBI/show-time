import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { Star, Clock, Calendar, Users, Ticket } from "lucide-react";
import fetchJson from "../utils/fetchJson";
import { calculatingTime } from "../utils/lengthcalc";
import { formatTime } from "../utils/formatTime";
import Trailer from "../parts/Trailer";

// --- Interfaces ---
interface Review {
    reviewId: number;
    author: string;
    rating: number;
    description: string;
}

interface Screening {
    screeningId: number;
    date: string;
    startTime: string;
    endTime: string;
}

interface MovieDetails {
    movieId: number;
    title: string;
    description: string;
    duration: number;
    trailer: string;
    releaseDate: string;
    actors: string;
    categories: string;
    averageRating: number;
    reviewCount: number;
    reviews: Review[];
    screenings: Screening[];
}

function MovieInfo() {
    const [movie, setMovie] = useState<MovieDetails | null>(null);
    const { id } = useParams<{ id: string; }>();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const getMovie = async () => {
            try {
                const result = await fetchJson(`/api/v_getMovieDetailsView?where=movieId=${id}`);
                if (result && result.length > 0) {
                    setMovie(result[0]);
                }
            } catch (error) {
                console.error("Kunde inte hämta film:", error);
            } finally {
                setLoading(false);
            }
        };
        if (id) getMovie();
    }, [id]);

    if (loading) return <div className="min-h-screen bg-[#1a1a1a] flex items-center justify-center text-white/50">Laddar...</div>;
    if (!movie) return <div className="min-h-screen bg-[#1a1a1a] flex items-center justify-center text-white/50">Filmen hittades inte.</div>;

    const genres = movie.categories ? movie.categories.split(', ') : [];
    const actorList = movie.actors ? movie.actors.split(', ') : [];

    return (
        <div className="min-h-screen bg-[#1a1a1a] text-stone-100 font-sans pb-40 relative overflow-x-hidden">

            {/* --- 1. CINEMATIC BACKGROUND --- */}
            <div className="absolute top-0 left-0 w-full h-[50vh] md:h-[700px] overflow-hidden z-0 pointer-events-none">
                <div
                    className="absolute inset-0 opacity-40 blur-[40px] md:blur-[60px] scale-110"
                    style={{
                        backgroundImage: `url(/images/posters/${movie.movieId}.webp)`,
                        backgroundPosition: 'center 20%',
                        backgroundSize: 'cover',
                        backgroundRepeat: 'no-repeat'
                    }}
                />
                <div className="absolute inset-0 bg-gradient-to-b from-[#1a1a1a]/30 via-[#1a1a1a]/60 to-[#1a1a1a]" />
            </div>

            {/* --- 2. CONTENT CONTAINER --- */}
            <div className="relative z-10">

                {/* BACK BUTTON */}
                <div className="max-w-7xl mx-auto px-4 md:px-6 pt-6 md:pt-8 pb-4">
                    <Link
                        to="/"
                        className="inline-flex items-center gap-2 text-white/80 hover:text-white transition-colors py-2 px-4 rounded-full bg-black/20 hover:bg-black/40 backdrop-blur-md border border-white/10 text-sm font-medium"
                    >
                        <span>←</span> Tillbaka
                    </Link>
                </div>

                {/* --- MAIN GRID --- */}
                <div className="max-w-7xl mx-auto px-4 md:px-6 mt-2 md:mt-6">
                    <div className="grid grid-cols-1 lg:grid-cols-[350px_1fr] gap-8 lg:gap-16 items-start">

                        {/* --- VÄNSTER (Poster) --- */}
                        <div className="flex flex-col items-center lg:items-start lg:sticky lg:top-24">
                            <div className="relative w-[240px] md:w-[300px] lg:w-full aspect-[2/3] rounded-2xl overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.5)] border border-white/10 group">
                                <img
                                    src={`/images/posters/${movie.movieId}.webp`}
                                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                                    alt={movie.title}
                                    onError={(e) => (e.target as HTMLImageElement).src = "https://via.placeholder.com/350x500"}
                                />
                            </div>

                            <div className="flex flex-wrap gap-2 mt-6 justify-center lg:justify-start w-full">
                                {genres.map((g, i) => (
                                    <span key={i} className="px-3 py-1 bg-white/5 border border-white/10 rounded-lg text-xs font-medium tracking-wide text-stone-300">
                                        {g}
                                    </span>
                                ))}
                            </div>
                        </div>

                        {/* --- HÖGER (Information) --- */}
                        <div className="flex flex-col gap-8 md:gap-10">

                            {/* TITEL & META */}
                            <div className="text-center lg:text-left">
                                <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-white tracking-tight mb-4 drop-shadow-xl leading-[1.1]">
                                    {movie.title}
                                </h1>

                                {/* HÄR VALDE VI "HEAD"-DELEN EFTERSOM DEN INNEHÅLLER METADATA */}
                                <div className="flex flex-wrap items-center justify-center lg:justify-start gap-x-6 gap-y-3 text-stone-300 text-sm md:text-base font-medium">
                                    <div className="flex items-center gap-1.5 text-[#C6A96A] bg-black/20 px-3 py-1 rounded-full border border-white/5 backdrop-blur-sm">
                                        <Star fill="currentColor" size={16} />
                                        <span className="text-white font-bold">{(movie.averageRating || 0).toFixed(1)}</span>
                                        <span className="text-white/50 text-xs ml-1">({movie.reviewCount})</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Clock size={18} className="text-white/60" />
                                        <span>{calculatingTime(movie.duration)}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Calendar size={18} className="text-white/60" />
                                        <span>{movie.releaseDate}</span>
                                    </div>
                                </div>
                            </div>

                            {/* HANDLING & ROLLER */}
                            <div className="space-y-6 md:space-y-8">
                                <div>
                                    <h3 className="text-lg text-white font-bold mb-2 border-l-4 border-[#C6A96A] pl-3">Handling</h3>
                                    <p className="text-stone-300 leading-relaxed text-base md:text-lg font-light">
                                        {movie.description}
                                    </p>
                                </div>

                                <div>
                                    <h3 className="text-xs text-white/50 uppercase tracking-widest font-bold mb-3 flex items-center gap-2">
                                        <Users size={14} /> I rollerna
                                    </h3>
                                    <div className="flex flex-wrap gap-x-4 gap-y-2 text-stone-200 text-sm md:text-base">
                                        {actorList.map((actor, idx) => (
                                            <span key={idx} className="bg-white/5 px-2 py-1 rounded hover:bg-white/10 transition-colors cursor-default border border-white/5">
                                                {actor}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            {/* --- BOKNINGS-SEKTION --- */}
                            <div className="bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 p-5 md:p-8 shadow-xl">
                                <div className="flex items-center gap-3 mb-6">
                                    <div className="p-2 bg-[#C6A96A]/20 rounded-lg">
                                        <Ticket className="text-[#C6A96A]" size={24} />
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-bold text-white">Boka biljetter</h3>
                                        <p className="text-xs text-white/50">Välj en tid som passar dig</p>
                                    </div>
                                </div>

                                {movie.screenings && movie.screenings.length > 0 ? (
                                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                                        {movie.screenings.map((screen) => (
                                            <button
                                                key={screen.screeningId}
                                                className="group relative flex flex-col items-center justify-center bg-primary hover:bg-red-800 hover:scale-105 border border-white/10 rounded-xl py-4 transition-all duration-300 shadow-lg"
                                                onClick={() => navigate(`/booking/${screen.screeningId}`)}
                                            >
                                                <span className="text-lg font-bold text-white mb-1">
                                                    {formatTime(screen.startTime)}
                                                </span>
                                                <span className="text-[10px] text-white/80 group-hover:text-white uppercase tracking-wider font-semibold bg-black/20 px-2 py-0.5 rounded">
                                                    {screen.date}
                                                </span>
                                            </button>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="text-center py-8 border-2 border-dashed border-white/10 rounded-xl bg-black/20">
                                        <p className="text-stone-500 italic">Inga visningar upplagda än.</p>
                                    </div>
                                )}
                            </div>

                            {/* TRAILER */}
                            <div className="rounded-2xl overflow-hidden shadow-2xl border border-white/10 bg-black">
                                <Trailer youtubeUrl={movie.trailer} />
                            </div>

                            {/* RECENSIONER */}
                            {movie.reviews && movie.reviews.length > 0 && (
                                <div className="pt-4">
                                    <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                                        Publikens röster <span className="bg-white/10 text-xs py-0.5 px-2 rounded-full text-stone-300">{movie.reviews.length}</span>
                                    </h3>
                                    <div className="grid gap-4 md:grid-cols-2">
                                        {movie.reviews.map((rev) => (
                                            <div key={rev.reviewId} className="bg-white/[0.03] backdrop-blur-sm border border-white/5 p-5 rounded-xl hover:bg-white/[0.06] transition-colors">
                                                <div className="flex justify-between items-start mb-3">
                                                    <span className="font-bold text-stone-200 text-sm">{rev.author}</span>
                                                    <div className="flex gap-0.5">
                                                        {[...Array(5)].map((_, i) => (
                                                            <Star key={i} size={12} fill={i < rev.rating ? "#C6A96A" : "none"} className={i < rev.rating ? "text-[#C6A96A]" : "text-stone-700"} />
                                                        ))}
                                                    </div>
                                                </div>
                                                <p className="text-stone-400 text-sm italic leading-relaxed">"{rev.description}"</p>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default MovieInfo;

MovieInfo.route = {
    path: "/film_info/:id"
};