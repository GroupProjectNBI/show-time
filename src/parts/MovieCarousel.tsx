import { Link } from "react-router-dom"; // För att kunna navigera till filmsidan utan att ladda om hela sidan
import Carousel from "react-multi-carousel"; // Själva karusell-komponenten
import "react-multi-carousel/lib/styles.css"; // Standard-CSS för att karusellen ska fungera (viktig!)
import Image from "./Image";
// Definierar hur ett film-objekt ser ut. '?' på title betyder att den är valfri.
interface Movie {
  id: number;
  title?: string;
}

// Definierar vilka props (indata) som komponenten tar emot.
interface MovieCarouselProps {
  popularMovie: Movie[];
}

const MovieCarousel = ({ popularMovie }: MovieCarouselProps) => {
  // SÄKERHET: Om popularMovie är null/undefined (innan datan hämtats), använd en tom lista []
  // så att sidan inte kraschar.
  const movies = popularMovie || [];

  // Om listan är tom, visa ingenting alls (returnera null).
  if (movies.length === 0) return null;

  // KONFIGURATION: Här bestämmer vi hur många filmer som syns beroende på skärmstorlek.
  const responsive = {
    desktop: {
      breakpoint: { max: 3000, min: 1024 }, // Från 1024px bredd och uppåt
      items: 3, // Visa exakt 3 filmer
      slidesToSlide: 1 // Flytta 1 film åt gången när man klickar pil/swipar
    },
    tablet: {
      breakpoint: { max: 1024, min: 464 }, // Mellan mobil och desktop
      items: 2, // Visa 2 filmer
    },
    mobile: {
      breakpoint: { max: 464, min: 0 }, // Små mobiler
      items: 1, // Visa 1 film (tar upp hela bredden)
    }
  };

  return (
    // CONTAINER-BOXEN
    // w-full: Tar 100% bredd av föräldern.
    // max-w-4xl: Sätter maxbredd till ca 896px (Detta gör den smalare än tidigare).
    // mx-auto: Centrerar boxen horisontellt (vänster/höger marginal blir automatisk).
    // py-10: Padding uppe och nere (luft).
    // px-4: Lite padding på sidorna så det inte slår i kanten på mobiler.
    <div className="w-full max-w-4xl mx-auto py-10 px-4">

      <Carousel
        // --- FUNKTIONALITET ---
        swipeable={true}    // Tillåter swipe på touch-skärmar
        draggable={true}    // Tillåter att man drar med musen på datorn
        showDots={false}    // Döljer prickarna under karusellen
        responsive={responsive} // Kopplar in config-objektet vi skrev ovan
        infinite={true}     // Gör att karusellen snurrar för evigt (startar om efter sista)

        // --- AUTOMATIK ---
        autoPlay={true}       // Karusellen rör sig själv
        autoPlaySpeed={10000} // Väntar 10 sekunder (10000ms) innan den byter

        // --- ANIMATION & KONTROLL ---
        keyBoardControl={true}    // Kan styras med pilarna på tangentbordet
        transitionDuration={1000} // Animationen tar 1 sekund (mjukt glid)

        // --- STYLING AV KARUSELLEN ---
        containerClass="carousel-container" // CSS-klass på själva "spåret"
        itemClass="px-2" // Viktigt! Lägger padding PÅ VARJE FILM så de inte sitter ihopklistrade.
      >
        {/* Mappa igenom filmerna och skapa ett kort för varje */}
        {movies.map((movie) => (

          // 'group': En Tailwind-klass som gör att vi kan styra barn-element (bilden)
          // när vi hovrar på föräldern (diven).
          <div key={movie.id} className="relative group">

            {/* Länken gör hela kortet klickbart */}
            <Link to={`/film_info/${movie.id}`}>

              {/* BILD-CONTAINER */}
              {/* overflow-hidden: Ser till att bilden inte sticker utanför rundningen när den zoomas */}
              {/* rounded-xl: Rundade hörn */}
              {/* border-white/10: En svag, genomskinlig vit ram */}
              <div className="overflow-hidden rounded-xl shadow-lg border border-white/10">

                <Image
                  src={`/images/posters/${movie.id}.webp`}
                  alt={movie.title || "Film"} // Visar texten "Film" om titel saknas

                  // BILD-STYLING
                  // h-[400px]: Tvingar höjden till exakt 400px
                  // object-cover: Beskär bilden snyggt så den fyller ytan utan att dras ut
                  // transition-transform duration-500: Animationen ska ta 0.5 sekunder
                  // group-hover:scale-110: När man hovrar på 'group' (diven ovan), zooma bilden till 110%
                  className="w-full h-[400px] object-cover transition-transform duration-500 group-hover:scale-110"

                  // Fallback: Om bilden inte hittas, visa en grå placeholder-bild
                  onError={(e) => (e.target as HTMLImageElement).src = "https://via.placeholder.com/300x450"}
                />

                {/* OVERLAY (TITEL VID HOVER) */}
                {/* absolute inset-0: Lägger sig EXAKT ovanpå bilden */}
                {/* opacity-0: Osynlig som standard */}
                {/* group-hover:opacity-100: Blir synlig när man hovrar på kortet */}
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">

                  {/* Visa bara titel om den finns */}
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