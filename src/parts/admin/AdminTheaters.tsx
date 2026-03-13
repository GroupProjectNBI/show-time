import { useEffect, useState } from "react";
import fetchJson from "../../utils/fetchJson";
import TheaterModal from "./TheaterModal.tsx";
import ConfirmDeleteModal from "./ConfirmDeleteModal.tsx";

interface Theater {
  id: number;
  name: string;
  seatsPerRow: number[];
}

export default function AdminTheaters() {
  const [theaters, setTheaters] = useState<Theater[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [selectedTheater, setSelectedTheater] = useState<Theater | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Theater | null>(null);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  const loadTheaters = async () => {
    try {
      const res = await fetchJson("/api/Theater");
      setTheaters(res || []);
    } catch (err) {
      console.error("Fel vid hämtning av salonger:", err);
      setError("Kunde inte ladda salonger.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTheaters();
  }, []);

  const openCreate = () => {
    setSelectedTheater(null);
    setIsModalOpen(true);
  };

  const openEdit = (theater: Theater) => {
    setSelectedTheater(theater);
    setIsModalOpen(true);
  };

  const openDelete = (theater: Theater) => {
    setDeleteTarget(theater);
    setIsDeleteOpen(true);
  };

  return (
    <section className="bg-[#222] p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold text-white mb-4">Salonger</h2>

      {loading && <p className="text-gray-400">Laddar salonger...</p>}
      {error && <p className="text-red-400">{error}</p>}

      {!loading && !error && theaters.length === 0 && (
        <p className="text-gray-400">Inga salonger hittades.</p>
      )}

      {!loading && !error && theaters.length > 0 && (
        <ul className="flex flex-col gap-3">
          {theaters.map((t) => (
            <li
              key={t.id}
              className="flex justify-between items-center bg-[#1a1a1a] p-3 rounded"
            >
              <div className="text-white">
                <p className="font-semibold">{t.name}</p>

                <p className="text-sm text-gray-400">
                  Rader: {t.seatsPerRow.length}
                </p>

                <p className="text-sm text-gray-400">
                  Totalt antal stolar:{" "}
                  {t.seatsPerRow.reduce((a, b) => a + b, 0)}
                </p>

                <p className="text-sm text-gray-400">
                  Layout: {t.seatsPerRow.join(", ")}
                </p>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => openEdit(t)}
                  className="text-blue-400 hover:underline"
                >
                  Redigera
                </button>
                <button
                  onClick={() => openDelete(t)}
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
        Lägg till salong
      </button>

      {isModalOpen && (
        <TheaterModal
          theater={selectedTheater}
          onClose={() => setIsModalOpen(false)}
          onSaved={loadTheaters}
        />
      )}

      {isDeleteOpen && deleteTarget && (
        <ConfirmDeleteModal
          target={deleteTarget}
          onClose={() => setIsDeleteOpen(false)}
          onConfirm={async () => {
            await fetchJson(`/api/Theater/${deleteTarget.id}`, {
              method: "DELETE",
            });
            setIsDeleteOpen(false);
            loadTheaters();
          }}
        />
      )}
    </section>
  );
}
