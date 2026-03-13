import { useEffect, useState } from "react";
import fetchJson from "../../utils/fetchJson";

export default function AdminSnackMenu() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadItems = async () => {
      try {
        // MVP: vi antar att du har en endpoint för snacks
        const res = await fetchJson("/api/SnackMenu");
        setItems(res || []);
      } catch (err) {
        console.error("Fel vid hämtning av snacks:", err);
        setError("Kunde inte ladda snacksmenyn.");
      } finally {
        setLoading(false);
      }
    };

    loadItems();
  }, []);

  return (
    <section className="bg-[#222] p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold text-white mb-4">
        Snacks & Dryck
      </h2>

      {loading && <p className="text-gray-400">Laddar meny...</p>}
      {error && <p className="text-red-400">{error}</p>}

      {!loading && !error && (
        <ul className="flex flex-col gap-3">
          {items.map((i: any) => (
            <li
              key={i.id}
              className="flex justify-between items-center bg-[#1a1a1a] p-3 rounded"
            >
              <div className="text-white">
                <p className="font-semibold">{i.name}</p>

                <p className="text-sm text-gray-400">
                  Pris: {i.price} kr
                </p>

                <p className="text-sm text-gray-400">
                  Kategori: {i.category}
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
        Lägg till menyobjekt
      </button>
    </section>
  );
}
