import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { Star, Clock, Calendar, Users } from "lucide-react"; // Installera lucide-react om ni inte har, eller använd text
import fetchJson from "../utils/fetchJson";
import { calculatingTime } from "../utils/lengthcalc";
import { formatTime } from "../utils/formatTime"; // Din tid-formatterare
import Trailer from "../parts/Trailer";

// 1. Vi definierar Interface baserat på din data-dump
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
    title: string;          // Notera: Heter 'title' i din nya data (inte movieTitle)
    description: string;
    duration: number;
    trailer: string;
    releaseDate: string;
    actors: string;         // Kommaseparerad sträng
    categories: string;     // Kommaseparerad sträng
    averageRating: number;
    reviewCount: number;
    reviews: Review[];      // Lista med objekt
    screenings: Screening[]; // Lista med objekt
}

function MovieInfo() {
    const [movie, setMovie] = useState<MovieDetails | null>(null);
    const { id } = useParams<{ id: string; }>();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const getMovie = async () => {
            try {
                // Hämta data (anpassa URL om det behövs)
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

    if (loading) return <div className="min-h-screen bg-stone-950 text-white flex items-center justify-center">Laddar...</div>;
    if (!movie) return <div className="min-h-screen bg-stone-950 text-white flex items-center justify-center">Filmen hittades inte.</div>;

    // Hjälpfunktion för att göra om "Action, Comedy" till en array
    const genres = movie.categories ? movie.categories.split(', ') : [];
    const actorList = movie.actors ? movie.actors.split(', ') : [];

    return (
        <div className="min-h-screen bg-stone-950 text-stone-100 font-sans pb-20">

            {/* --- SEKTION 1: HEADER & TITEL (I TOPP) --- */}
            <div className="bg-gradient-to-b from-stone-900 to-stone-950 border-b border-stone-800 pt-10 pb-10 px-6">
                <div className="max-w-6xl mx-auto">
                    <Link to="/" className="text-stone-400 hover:text-white text-sm mb-6 inline-block">← Tillbaka</Link>

                    <h1 className="text-4xl md:text-6xl font-bold text-white tracking-tight mb-4">
                        {movie.title}
                    </h1>

                    {/* Meta-rad: Betyg | Tid | Genre */}
                    <div className="flex flex-wrap items-center gap-6 text-stone-300 text-sm md:text-base">

                        {/* Betyg */}
                        <div className="flex items-center gap-1 text-yellow-500">
                            <Star fill="currentColor" size={20} />
                            <span className="font-bold text-white text-lg">
                                {/* HÄR VAR FELET: Vi lägger till ( || 0 ) */}
                                {(movie.averageRating || 0).toFixed(1)}
                            </span>
                            <span className="text-stone-500">
                                ({movie.reviewCount || 0} röster)
                            </span>
                        </div>

                        {/* Längd */}
                        <div className="flex items-center gap-2">
                            <Clock size={18} />
                            <span>{calculatingTime(movie.duration)}</span>
                        </div>

                        {/* Premiär */}
                        <div className="flex items-center gap-2">
                            <Calendar size={18} />
                            <span>{movie.releaseDate}</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* --- SEKTION 2: HUVUDINNEHÅLL --- */}
            <div className="max-w-6xl mx-auto px-6 mt-10">
                <div className="grid grid-cols-1 lg:grid-cols-[350px_1fr] gap-12">

                    {/* VÄNSTER: Poster */}
                    <div>
                        <img
                            src={`/images/posters/${movie.movieId}.webp`}
                            className="w-full rounded-xl shadow-2xl aspect-[2/3] object-cover"
                            alt={movie.title}
                            onError={(e) => (e.target as HTMLImageElement).src = "https://via.placeholder.com/350x500"}
                        />

                        {/* Genre Taggar */}
                        <div className="flex flex-wrap gap-2 mt-6">
                            {genres.map((g, i) => (
                                <span key={i} className="px-3 py-1 bg-stone-800 rounded-full text-xs text-stone-300 border border-stone-700">
                                    {g}
                                </span>
                            ))}
                        </div>
                    </div>

                    {/* HÖGER: Info, Trailer & Bokning */}
                    <div className="flex flex-col gap-8">

                        {/* Beskrivning */}
                        <div>
                            <h3 className="text-xl text-white font-semibold mb-2">Handling</h3>
                            <p className="text-stone-300 leading-relaxed text-lg">
                                {movie.description}
                            </p>
                        </div>

                        {/* Skådespelare */}
                        <div>
                            <h3 className="text-stone-400 text-sm uppercase tracking-wide mb-2 flex items-center gap-2">
                                <Users size={16} /> I rollerna
                            </h3>
                            <p className="text-stone-200">
                                {actorList.slice(0, 5).join(", ")}
                                {actorList.length > 5 && <span className="text-stone-500"> m.fl.</span>}
                            </p>
                        </div>

                        {/* BOKNING (Screenings) */}
                        <div className="bg-stone-900 p-6 rounded-xl border border-stone-800">
                            <h3 className="text-xl font-bold text-white mb-4">Välj visning</h3>

                            {movie.screenings && movie.screenings.length > 0 ? (
                                <div className="flex flex-wrap gap-3">
                                    {movie.screenings.map((screen) => (
                                        <button
                                            key={screen.screeningId}
                                            className="flex flex-col items-center bg-primary hover:bg-booked text-white px-5 py-3 rounded-lg transition"
                                            onClick={() => console.log("Gå till bokning för ID:", screen.screeningId)}
                                        >
                                            <span className="font-bold text-lg">{formatTime(screen.startTime)}</span>
                                            <span className="text-xs opacity-80">{screen.date}</span>
                                        </button>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-stone-500 italic">Inga visningar upplagda än.</p>
                            )}
                        </div>

                        {/* Trailer */}
                        <Trailer youtubeUrl={movie.trailer} />

                        {/* Recensioner */}
                        {movie.reviews && movie.reviews.length > 0 && (
                            <div className="mt-8 border-t border-stone-800 pt-8">
                                <h3 className="text-xl font-bold mb-4">Recensioner</h3>
                                <div className="space-y-4">
                                    {movie.reviews.map((rev) => (
                                        <div key={rev.reviewId} className="bg-stone-900/50 p-4 rounded-lg">
                                            <div className="flex justify-between mb-2">
                                                <span className="font-bold text-white">{rev.author}</span>
                                                <div className="flex text-yellow-500">
                                                    {[...Array(5)].map((_, i) => (
                                                        <Star key={i} size={14} fill={i < rev.rating ? "currentColor" : "none"} className={i < rev.rating ? "" : "text-stone-700"} />
                                                    ))}
                                                </div>
                                            </div>
                                            <p className="text-stone-400 text-sm">"{rev.description}"</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

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