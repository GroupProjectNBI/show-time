import { useEffect, useState } from "react";
import fetchJson from "../../utils/fetchJson";
import ScreeningModal from "./ScreeningModal.tsx";
import ConfirmDeleteModal from "./ConfirmDeleteModal.tsx";

interface Screening {
  id: number;
  movieId: number;
  movieTitle: string;
  theaterId: number;
  theaterName: string;
  startTime: string;
  startTimeFormatted: string;
}

export default function AdminScreenings() {
  const [screenings, setScreenings] = useState<Screening[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [selectedScreening, setSelectedScreening] = useState<Screening | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Screening | null>(null);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  const loadScreenings = async () => {
    try {
      const res = await fetchJson("/api/v_screenings_admin");
      setScreenings(res || []);
    } catch (err) {
      console.error("Fel vid hämtning av visningar:", err);
      setError("Kunde inte ladda visningar.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadScreenings();
  }, []);

  const openCreate = () => {
    setSelectedScreening(null);
    setIsModalOpen(true);
  };

  const openEdit = (screening: Screening) => {
    setSelectedScreening(screening);
    setIsModalOpen(true);
  };

  const openDelete = (screening: Screening) => {
    setDeleteTarget(screening);
    setIsDeleteOpen(true);
  };

  return (
    <section className="bg-[#222] p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold text-white mb-4">Visningar</h2>

      {loading && <p className="text-gray-400">Laddar visningar...</p>}
      {error && <p className="text-red-400">{error}</p>}

      {!loading && !error && screenings.length === 0 && (
        <p className="text-gray-400">Inga visningar hittades.</p>
      )}

      {!loading && !error && screenings.length > 0 && (
        <ul className="flex flex-col gap-3">
          {screenings.map((s) => (
            <li
              key={s.id}
              className="flex justify-between items-center bg-[#1a1a1a] p-3 rounded"
            >
              <div className="text-white">
                <p className="font-semibold">{s.movieTitle}</p>
                <p className="text-sm text-gray-400">{s.startTimeFormatted}</p>
                <p className="text-sm text-gray-400">Salong: {s.theaterName}</p>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => openEdit(s)}
                  className="text-blue-400 hover:underline"
                >
                  Redigera
                </button>
                <button
                  onClick={() => openDelete(s)}
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
        Lägg till visning
      </button>

      {isModalOpen && (
        <ScreeningModal
          screening={selectedScreening}
          onClose={() => setIsModalOpen(false)}
          onSaved={loadScreenings}
        />
      )}

      {isDeleteOpen && deleteTarget && (
        <ConfirmDeleteModal
          target={deleteTarget}
          onClose={() => setIsDeleteOpen(false)}
          onConfirm={async () => {
            await fetchJson(`/api/Screening/${deleteTarget.id}`, {
              method: "DELETE",
            });
            setIsDeleteOpen(false);
            loadScreenings();
          }}
        />
      )}
    </section>
  );
}
