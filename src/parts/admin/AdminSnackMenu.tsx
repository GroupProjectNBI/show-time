import { useEffect, useState } from "react";
import fetchJson from "../../utils/fetchJson";
import SnackModal from "./SnackModal.tsx";
import ConfirmDeleteModal from "./ConfirmDeleteModal.tsx";

interface SnackItem {
  id: number;
  name: string;
  price: number;
  category: string;
}

export default function AdminSnackMenu() {
  const [items, setItems] = useState<SnackItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [selectedItem, setSelectedItem] = useState<SnackItem | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<SnackItem | null>(null);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  const loadItems = async () => {
    try {
      const res = await fetchJson("/api/SnackMenu");
      setItems(res || []);
    } catch (err) {
      console.error("Fel vid hämtning av snacks:", err);
      setError("Kunde inte ladda snacksmenyn.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadItems();
  }, []);

  const openCreate = () => {
    setSelectedItem(null);
    setIsModalOpen(true);
  };

  const openEdit = (item: SnackItem) => {
    setSelectedItem(item);
    setIsModalOpen(true);
  };

  const openDelete = (item: SnackItem) => {
    setDeleteTarget(item);
    setIsDeleteOpen(true);
  };

  return (
    <section className="bg-[#222] p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold text-white mb-4">
        Snacks & Dryck
      </h2>

      {loading && <p className="text-gray-400">Laddar meny...</p>}
      {error && <p className="text-red-400">{error}</p>}

      {!loading && !error && items.length === 0 && (
        <p className="text-gray-400">Inga menyobjekt hittades.</p>
      )}

      {!loading && !error && items.length > 0 && (
        <ul className="flex flex-col gap-3">
          {items.map((i) => (
            <li
              key={i.id}
              className="flex justify-between items-center bg-[#1a1a1a] p-3 rounded"
            >
              <div className="text-white">
                <p className="font-semibold">{i.name}</p>
                <p className="text-sm text-gray-400">Pris: {i.price} kr</p>
                <p className="text-sm text-gray-400">Kategori: {i.category}</p>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => openEdit(i)}
                  className="text-blue-400 hover:underline"
                >
                  Redigera
                </button>
                <button
                  onClick={() => openDelete(i)}
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
        Lägg till menyobjekt
      </button>

      {isModalOpen && (
        <SnackModal
          item={selectedItem}
          onClose={() => setIsModalOpen(false)}
          onSaved={loadItems}
        />
      )}

      {isDeleteOpen && deleteTarget && (
        <ConfirmDeleteModal
          target={deleteTarget}
          onClose={() => setIsDeleteOpen(false)}
          onConfirm={async () => {
            await fetchJson(`/api/SnackMenu/${deleteTarget.id}`, {
              method: "DELETE",
            });
            setIsDeleteOpen(false);
            loadItems();
          }}
        />
      )}
    </section>
  );
}
