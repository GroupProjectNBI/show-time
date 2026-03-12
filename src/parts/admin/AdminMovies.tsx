import { useEffect, useState } from "react";
import fetchJson from "../../utils/fetchJson";

export default function AdminMovies() {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadMovies = async () => {
      try {
        const res = await fetchJson("/api/v_getMovieDetailsView");
        setMovies(res || []);
      } catch (err) {
        console.error("Fel vid hämtning av filmer:", err);
        setError("Kunde inte ladda filmer.");
      } finally {
        setLoading(false);
      }
    };

    loadMovies();
  }, []);

  return (
    <section className="bg-[#222] p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold text-white mb-4">
        Filmer
      </h2>

      {loading && <p className="text-gray-400">Laddar filmer...</p>}
      {error && <p className="text-red-400">{error}</p>}

      {!loading && !error && (
        <ul className="flex flex-col gap-3">
          {movies.map((m: any) => (
            <li
              key={m.movieId}
              className="flex justify-between items-center bg-[#1a1a1a] p-3 rounded"
            >
              <div className="text-white">
                <p className="font-semibold">{m.title}</p>
                <p className="text-sm text-gray-400">
                  {m.categories} • {m.ageLimit}+
                </p>
              </div>

              <div className="flex gap-3">
                <button className="text-blue-400 hover:underline">
                  Redigera
                </button>
                <button className="text-red-400 hover:underline">
                  Ta bort
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}

      <button className="mt-6 bg-primary text-black px-4 py-2 rounded font-semibold">
        Lägg till film
      </button>
    </section>
  );
}
