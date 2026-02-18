import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface Movie {
    id: number;
    title?: string;
}

interface MovieCarouselProps {
    popularMovie: Movie[];
}

const MovieCarousel3D = ({ popularMovie }: MovieCarouselProps) => {
    const movies = popularMovie || [];
    const [currentIndex, setCurrentIndex] = useState(0);

    const [touchStart, setTouchStart] = useState<number | null>(null);
    const [touchEnd, setTouchEnd] = useState<number | null>(null);

    useEffect(() => {
        const interval = setInterval(() => {
            handleNext();
        }, 5000);
        return () => clearInterval(interval);
    }, [currentIndex]);

    if (movies.length === 0) return null;

    const handleNext = () => {
        setCurrentIndex((prev) => (prev + 1) % movies.length);
    };

    const handlePrev = () => {
        setCurrentIndex((prev) => (prev - 1 + movies.length) % movies.length);
    };

    const minSwipeDistance = 50;

    const onTouchStart = (e: React.TouchEvent) => {
        setTouchEnd(null);
        setTouchStart(e.targetTouches[0].clientX);
    };

    const onTouchMove = (e: React.TouchEvent) => {
        setTouchEnd(e.targetTouches[0].clientX);
    };

    const onTouchEnd = () => {
        if (!touchStart || !touchEnd) return;
        const distance = touchStart - touchEnd;
        const isLeftSwipe = distance > minSwipeDistance;
        const isRightSwipe = distance < -minSwipeDistance;

        if (isLeftSwipe) handleNext();
        if (isRightSwipe) handlePrev();
    };

    const getPosition = (index: number) => {
        const total = movies.length;
        let distance = (index - currentIndex + total) % total;
        if (distance > total / 2) distance -= total;
        return distance;
    };

    return (
        <div className="relative w-full py-6 md:py-10 flex flex-col justify-center items-center perspective-1000 overflow-hidden">

            {/* DESKTOP PILAR */}
            <button
                onClick={handlePrev}
                className="absolute left-4 md:left-10 z-50 bg-black/40 hover:bg-[#680909] text-white p-3 rounded-full backdrop-blur-md transition-all hidden md:block hover:scale-110"
            >
                <ChevronLeft size={32} />
            </button>

            <button
                onClick={handleNext}
                className="absolute right-4 md:right-10 z-50 bg-black/40 hover:bg-[#680909] text-white p-3 rounded-full backdrop-blur-md transition-all hidden md:block hover:scale-110"
            >
                <ChevronRight size={32} />
            </button>

            {/* KARUSELL CONTAINER - ÖKAD HÖJD HÄR (från 600px till 700px på desktop) */}
            <div
                className="relative w-full max-w-7xl h-[500px] md:h-[700px] flex justify-center items-center touch-pan-y"
                onTouchStart={onTouchStart}
                onTouchMove={onTouchMove}
                onTouchEnd={onTouchEnd}
            >
                {movies.map((movie, index) => {
                    const distance = getPosition(index);
                    const isActive = distance === 0;
                    const isPrev = distance === -1;
                    const isNext = distance === 1;

                    if (Math.abs(distance) > 2) return null;

                    let zIndex = 10;
                    let opacity = 0;
                    let transform = "";

                    if (isActive) {
                        zIndex = 70;
                        opacity = 1;
                        transform = "translateX(0) scale(1)";
                    } else if (isPrev) {
                        zIndex = 20;
                        // ÄNDRING: Ökad opacity (0.7) och storlek (scale 0.9)
                        // ÄNDRING: Minskad translateX (-55%) så de sticker ut mer
                        opacity = 0.7;
                        transform = "translateX(-55%) scale(0.9)";
                    } else if (isNext) {
                        zIndex = 10;
                        // Samma ändringar här för högersidan
                        opacity = 0.7;
                        transform = "translateX(55%) scale(0.9)";
                    } else {
                        zIndex = 10;
                        opacity = 0;
                        transform = distance < 0 ? "translateX(-30%) scale(0.7)" : "translateX(30%) scale(0.7)";
                    }

                    return (
                        <div
                            key={movie.id}
                            className="absolute transition-all duration-700 ease-[cubic-bezier(0.25,0.8,0.25,1)] cursor-pointer"
                            style={{
                                zIndex,
                                opacity,
                                transform: window.innerWidth >= 768
                                    ? (isPrev ? "translateX(-55%) scale(0.9)" : isNext ? "translateX(55%) scale(0.9)" : transform)
                                    : transform,
                                // ÄNDRING: Ökad max-width till 500px för att göra dem maffigare
                                width: 'clamp(280px, 65vw, 500px)',
                            }}
                            onClick={() => {
                                if (isPrev) handlePrev();
                                if (isNext) handleNext();
                            }}
                        >
                            <div className={isActive ? "pointer-events-auto" : "pointer-events-none"}>
                                <Link to={`/film_info/${movie.id}`}>
                                    <div className={`
                    relative overflow-hidden rounded-2xl border border-white/10 bg-[#1a1a1a] 
                    /* ÄNDRING: Ökad höjd på själva korten */
                    h-[450px] md:h-[650px]
                    shadow-[0_10px_40px_rgba(0,0,0,0.5)]
                    transition-all duration-500
                    /* ÄNDRING: brightness-75 istället för 50 på sidokorten = mer spotlight */
                    ${isActive ? 'shadow-[0_25px_80px_rgba(198,169,106,0.4)] border-white/30 brightness-100' : 'brightness-75 hover:brightness-90'}
                  `}>
                                        <img
                                            src={`/images/posters/${movie.id}.webp`}
                                            alt={movie.title}
                                            className="w-full h-full object-cover"
                                            draggable={false}
                                        />

                                        <div className={`
                      absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent 
                      flex items-end justify-center pb-8 transition-opacity duration-500
                      ${isActive ? 'opacity-100' : 'opacity-0'}
                    `}>
                                            <h3 className="text-white text-xl md:text-4xl font-bold text-center px-4 drop-shadow-xl translate-y-2">
                                                {movie.title}
                                            </h3>
                                        </div>
                                    </div>
                                </Link>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Paginering */}
            <div className="flex gap-2 mt-4 z-40">
                {movies.map((_, idx) => (
                    <button
                        key={idx}
                        onClick={() => setCurrentIndex(idx)}
                        className={`
              h-1.5 rounded-full transition-all duration-500
              ${idx === currentIndex ? 'bg-[#c0a060] w-8' : 'bg-white/20 w-2 hover:bg-white/40'}
            `}
                    />
                ))}
            </div>
        </div>
    );
};

export default MovieCarousel3D;