import { useRef, useEffect } from "react";
import { ChevronLeft, ChevronRight, Check } from "lucide-react";

interface Avatar {
    id: number;
    url: string;
}

interface Props {
    avatars: Avatar[];
    selectedId: number;
    onSelect: (id: number) => void;
}

export default function AvatarSelector({ avatars, selectedId, onSelect }: Props) {
    const scrollRef = useRef<HTMLDivElement>(null);

    const scroll = (direction: "left" | "right") => {
        if (scrollRef.current) {
            const { scrollLeft, clientWidth } = scrollRef.current;
            const move = clientWidth / 1.5;
            scrollRef.current.scrollTo({
                left: direction === "left" ? scrollLeft - move : scrollLeft + move,
                behavior: "smooth",
            });
        }
    };

    useEffect(() => {
        const timer = setTimeout(() => {
            const active = scrollRef.current?.querySelector('.ring-red-600');
            if (active) {
                active.scrollIntoView({
                    behavior: 'auto', // Ingen animation här = ingen ryckighet
                    inline: 'center',
                    block: 'nearest'
                });
            }
        }, 50); // Kortare delay
        return () => clearTimeout(timer);
    }, [avatars]);


    return (
        <div className="mb-8">
            <p className="text-accent/60 text-[10px] uppercase text-center mb-3 tracking-[0.2em]">
                Välj din karaktär
            </p>

            <div className="relative flex items-center group">
                {/* --- FADE EFFEKTER --- */}
                {/* Vänster fade - tonar ut mot bakgrundsfärgen */}
                <div className="absolute left-0 top-0 bottom-0 w-12 bg-gradient-to-r from-primary/95 to-transparent z-10 pointer-events-none" />

                {/* Höger fade - tonar ut mot bakgrundsfärgen */}
                <div className="absolute right-0 top-0 bottom-0 w-12 bg-gradient-to-l from-primary/95 to-transparent z-10 pointer-events-none" />

                {/* Vänster pil */}
                <button
                    type="button"
                    onClick={() => scroll("left")}
                    className="absolute -left-6 z-30 p-1.5 text-accent/50 hover:text-accent transition-all bg-primary border border-white/10 rounded-full shadow-xl"
                >
                    <ChevronLeft size={18} />
                </button>

                {/* Karusell-container */}
                <div
                    ref={scrollRef}
                    className="
        flex gap-4 overflow-x-auto py-2 px-10 
        snap-x snap-mandatory 
        justify-start md:justify-center
        /* Dessa tre rader tvingar bort scrollbaren i alla webbläsare: */
        [&::-webkit-scrollbar]:hidden 
        [-ms-overflow-style:none] 
        [scrollbar-width:none]
    "
                >
                    {avatars.map((avatar) => (
                        <button
                            key={avatar.id}
                            type="button"
                            onClick={() => onSelect(avatar.id)}
                            className={`
                relative flex-shrink-0 w-12 h-12 rounded-full transition-all duration-300 snap-center
                ${selectedId === avatar.id
                                    ? "ring-2 ring-red-600 ring-offset-2 ring-offset-primary scale-110"
                                    : "opacity-40 grayscale hover:grayscale-0 hover:opacity-100"
                                }
              `}
                        >
                            {/* Vit bakgrund gör att mörka ikoner syns */}
                            <div className="w-full h-full rounded-full bg-white p-1.5 shadow-inner">
                                <img
                                    src={avatar.url}
                                    alt="Avatar"
                                    className="w-full h-full object-contain"
                                />
                            </div>

                            {/* Check-ikon vid vald */}
                            {selectedId === avatar.id && (
                                <div className="absolute -bottom-1 -right-1 bg-red-600 text-white rounded-full w-4 h-4 flex items-center justify-center shadow-lg border border-primary">
                                    <Check size={10} strokeWidth={4} />
                                </div>
                            )}
                        </button>
                    ))}
                </div>

                {/* Höger pil */}
                <button
                    type="button"
                    onClick={() => scroll("right")}
                    className="absolute -right-6 z-30 p-1.5 text-accent/50 hover:text-accent transition-all bg-primary border border-white/10 rounded-full shadow-xl"
                >
                    <ChevronRight size={18} />
                </button>
            </div>
        </div>
    );
}