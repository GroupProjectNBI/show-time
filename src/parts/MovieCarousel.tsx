import { Link } from "react-router-dom";
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";

interface Movie {
  id: number;
  title?: string;
}

interface MovieCarouselProps {
  popularMovie: Movie[];
}

const MovieCarousel = ({ popularMovie }: MovieCarouselProps) => {
  const movies = popularMovie || [];

  if (movies.length === 0) return null;

  const responsive = {
    desktop: {
      breakpoint: { max: 3000, min: 1024 },
      items: 3,
      slidesToSlide: 1
    },
    tablet: {
      breakpoint: { max: 1024, min: 464 },
      items: 2,
    },
    mobile: {
      breakpoint: { max: 464, min: 0 },
      items: 1,
    }
  };

  return (
    // ÄNDRING HÄR: max-w-4xl (var max-w-5xl)
    // Detta gör den ännu smalare, ca 896px som maxbredd.
    <div className="w-full max-w-4xl mx-auto py-10 px-4">
      <Carousel
        swipeable={true}
        draggable={true}
        showDots={false}
        responsive={responsive}
        infinite={true}
        autoPlay={true}
        autoPlaySpeed={10000}
        keyBoardControl={true}
        transitionDuration={1000}
        containerClass="carousel-container"
        itemClass="px-2"
      >
        {movies.map((movie) => (
          <div key={movie.id} className="relative group">
            <Link to={`/film_info/${movie.id}`}>
              <div className="overflow-hidden rounded-xl shadow-lg border border-white/10">
                <img
                  src={`/images/posters/${movie.id}.webp`}
                  alt={movie.title || "Film"}
                  className="w-full h-[400px] object-cover transition-transform duration-500 group-hover:scale-110"
                  onError={(e) => (e.target as HTMLImageElement).src = "https://via.placeholder.com/300x450"}
                />
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  {movie.title && (
                    <h3 className="text-white font-bold text-center px-2 drop-shadow-md">
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

export default MovieCarousel;