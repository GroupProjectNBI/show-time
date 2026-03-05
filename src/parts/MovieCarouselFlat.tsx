import { Link } from "react-router-dom";
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import Image from "./Image";
interface Movie {
    id: number;
    title?: string;
}

interface MovieCarouselProps {
    popularMovie: Movie[];
}

const MovieCarouselFlat = ({ popularMovie }: MovieCarouselProps) => {
    const movies = popularMovie || [];

    if (movies.length === 0) return null;

    const responsive = {
        desktop: {
            breakpoint: { max: 3000, min: 1024 },
            items: 3,
        },
        tablet: {
            breakpoint: { max: 1024, min: 640 },
            items: 2,
        },
        mobile: {
            breakpoint: { max: 640, min: 0 },
            items: 1,
            partialVisibilityGutter: 30
        }
    };

    return (
        <div className="w-full">
            <Carousel
                swipeable={true}
                draggable={true}
                showDots={true}
                responsive={responsive}
                infinite={true}
                autoPlay={true}
                autoPlaySpeed={5000}
                keyBoardControl={true}
                transitionDuration={500}
                containerClass="carousel-container pb-10"
                itemClass="px-2 md:px-4"
                removeArrowOnDeviceType={["tablet", "mobile"]}
            >
                {movies.map((movie) => (
                    <div key={movie.id} className="relative group perspective-1000">
                        <Link to={`/film_info/${movie.id}`}>
                            <div className="overflow-hidden rounded-2xl shadow-lg border border-white/5 bg-[#1a1a1a] transition-all duration-300 group-hover:-translate-y-2 group-hover:shadow-[0_20px_40px_rgba(198,169,106,0.2)]">

                                <Image
                                    src={`/images/posters/${movie.id}.webp`}
                                    alt={movie.title || "Film"}
                                    // Anpassade höjder för den platta designen
                                    className="w-full h-[450px] md:h-[550px] lg:h-[600px] object-cover"
                                    onError={(e) => (e.target as HTMLImageElement).src = "https://via.placeholder.com/400x600?text=No+Poster"}
                                />

                                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center pb-8">
                                    {movie.title && (
                                        <h3 className="text-white text-xl font-bold text-center px-4 drop-shadow-md transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                                            {movie.title}
                                        </h3>
                                    )}
                                </div>
                            </div>
                        </Link>
                    </div>
                ))}
            </Carousel>
        </div>
    );
};

export default MovieCarouselFlat;