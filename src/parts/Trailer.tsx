
interface TrailerProps {
    youtubeUrl: string;
    hero?: boolean; // Ny prop! Valfri (default false)
}

export default function Trailer({ youtubeUrl, hero = false }: TrailerProps) {

    const getYouTubeId = (url: string) => {
        if (!url) return null;
        const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
        const match = url.match(regExp);
        return (match && match[2].length === 11) ? match[2] : null;
    };

    const videoId = getYouTubeId(youtubeUrl);

    if (!videoId) return null;

    return (
        // Om hero är true: Inga marginaler (w-full). Annars: mt-8 och rubrik.
        <div className={hero ? "w-full" : "mt-8 w-full"}>

            {/* Visa bara rubriken om det INTE är hero-mode */}
            {!hero && <h2 className="mb-4 text-xl font-semibold text-white">Trailer</h2>}

            <div className={`aspect-video relative w-full overflow-hidden bg-black shadow-lg ${hero ? 'rounded-t-xl' : 'rounded-xl'}`}>
                <iframe
                    className="absolute inset-0 h-full w-full"
                    src={`https://www.youtube.com/embed/${videoId}?autoplay=${hero ? 1 : 0}&mute=${hero ? 1 : 0}`} // Tips: Autoplay + Mute är vanligt för hero
                    title="YouTube video player"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowFullScreen
                    loading="lazy"
                />
            </div>
        </div>
    );
}