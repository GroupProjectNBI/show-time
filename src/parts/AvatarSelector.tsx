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

    // Funktion för att scrolla manuellt med pilarna
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

    // Centrerar den valda avataren när komponenten laddas
    useEffect(() => {
        const timer = setTimeout(() => {
            const active = scrollRef.current?.querySelector('.ring-red-600');
            if (active) {
                active.scrollIntoView({
                    behavior: 'auto',
                    inline: 'center',
                    block: 'nearest'
                });
            }
        }, 100);
        return () => clearTimeout(timer);
    }, [avatars]);

    return (
        <div className="mb-8">
            <p className="text-accent/60 text-[10px] uppercase text-center mb-3 tracking-[0.2em]">
                Välj din karaktär
            </p>

            {/* max-w-[280px] begränsar vyn så att ca 3 ikoner syns på mobil */}
            <div className="relative flex items-center group max-w-[280px] mx-auto">

                {/* --- FADE EFFEKTER --- */}
                <div className="absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-primary/95 to-transparent z-10 pointer-events-none hidden md:block" />
                <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-primary/95 to-transparent z-10 pointer-events-none hidden md:block" />

                {/* VÄNSTER PIL */}
                <button
                    type="button"
                    onClick={() => scroll("left")}
                    className="absolute left-0 z-30 p-2 bg-white/10 hover:bg-white/20 border border-white/10 rounded-full text-accent transition-all flex items-center justify-center shadow-lg md:hidden"
                    aria-label="Scrolla vänster"
                >
                    <ChevronLeft size={16} />
                </button>

                {/* KARUSELL-CONTAINER */}
                <div
                    ref={scrollRef}
                    className="
            flex gap-3 overflow-x-auto py-2 px-8
            snap-x snap-mandatory 
            justify-start md:justify-center
            no-scrollbar
            [&::-webkit-scrollbar]:hidden 
            [-ms-overflow-style:none] 
            [scrollbar-width:none]
            w-full
        "
                >
                    {avatars.map((avatar) => (
                        <button
                            key={avatar.id}
                            type="button"
                            onClick={() => onSelect(avatar.id)}
                            className={`
                    relative flex-shrink-0 w-10 h-10 rounded-full transition-all duration-300 snap-center
                    ${selectedId === avatar.id
                                    ? "ring-2 ring-red-600 ring-offset-2 ring-offset-primary scale-110 z-20"
                                    : "opacity-40 grayscale hover:grayscale-0 hover:opacity-100"
                                }
                `}
                        >
                            <div className="w-full h-full rounded-full bg-white p-1 shadow-md flex items-center justify-center">
                                <img
                                    src={avatar.url}
                                    alt="Avatar"
                                    className="w-full h-full object-contain"
                                />
                            </div>
                            {selectedId === avatar.id && (
                                <div className="absolute -bottom-1 -right-1 bg-red-600 text-white rounded-full w-3.5 h-3.5 flex items-center justify-center shadow-lg border border-primary">
                                    <Check size={8} strokeWidth={4} />
                                </div>
                            )}
                        </button>
                    ))}
                </div>

                {/* HÖGER PIL */}
                <button
                    type="button"
                    onClick={() => scroll("right")}
                    className="absolute right-0 z-30 p-2 bg-white/10 hover:bg-white/20 border border-white/10 rounded-full text-accent transition-all flex items-center justify-center shadow-lg md:hidden"
                    aria-label="Scrolla höger"
                >
                    <ChevronRight size={16} />
                </button>
            </div>
        </div>
    );
}