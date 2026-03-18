import { useEffect, useState } from "react";
import fetchJson from "../../utils/fetchJson";
import MovieModal from "./MovieModal.tsx";
import ConfirmDeleteModal from "./ConfirmDeleteModal.tsx";

interface Movie {
  id: number;
  title: string;
  description: string;
  duration: number;
  ageLimit: number;
  categories: string;
  posterUrl: string;
}

export default function AdminMovies() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Movie | null>(null);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  const loadMovies = async () => {
    try {
      const res = await fetchJson("/api/Movie");
      setMovies(res || []);
    } catch (err) {
      console.error("Fel vid hämtning av filmer:", err);
      setError("Kunde inte ladda filmer.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMovies();
  }, []);

  const openCreate = () => {
    setSelectedMovie(null);
    setIsModalOpen(true);
  };

  const openEdit = (movie: Movie) => {
    setSelectedMovie(movie);
    setIsModalOpen(true);
  };

  const openDelete = (movie: Movie) => {
    setDeleteTarget(movie);
    setIsDeleteOpen(true);
  };

  return (
    <section className="bg-[#222] p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold text-white mb-4">Filmer</h2>

      {loading && <p className="text-gray-400">Laddar filmer...</p>}
      {error && <p className="text-red-400">{error}</p>}

      {!loading && !error && movies.length === 0 && (
        <p className="text-gray-400">Inga filmer hittades.</p>
      )}

      {!loading && !error && movies.length > 0 && (
        <ul className="flex flex-col gap-3">
          {movies.map((m) => (
            <li
              key={m.id}
              className="flex justify-between items-center bg-[#1a1a1a] p-3 rounded"
            >
              <div className="text-white">
                <p className="font-semibold">{m.title}</p>
                <p className="text-sm text-gray-400">
                  {m.duration} min • {m.ageLimit}+ • {m.categories}
                </p>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => openEdit(m)}
                  className="text-blue-400 hover:underline"
                >
                  Redigera
                </button>
                <button
                  onClick={() => openDelete(m)}
                  className="text-red-400 hover:underline"
                >
                  Ta bort
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}

      <button
        onClick={openCreate}
        className="mt-6 bg-primary text-black px-4 py-2 rounded font-semibold"
      >
        Lägg till film
      </button>

      {isModalOpen && (
        <MovieModal
          movie={selectedMovie}
          onClose={() => setIsModalOpen(false)}
          onSaved={loadMovies}
        />
      )}

      {isDeleteOpen && deleteTarget && (
        <ConfirmDeleteModal
          target={deleteTarget}
          onClose={() => setIsDeleteOpen(false)}
          onConfirm={async () => {
            await fetchJson(`/api/Movie/${deleteTarget.id}`, {
              method: "DELETE",
            });
            setIsDeleteOpen(false);
            loadMovies();
          }}
        />
      )}
    </section>
  );
}
