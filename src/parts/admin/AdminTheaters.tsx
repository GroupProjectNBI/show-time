import { useEffect, useState } from "react";
import fetchJson from "../../utils/fetchJson";

export default function AdminTheaters() {
  const [theaters, setTheaters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadTheaters = async () => {
      try {
        // MVP: vi antar att du har en endpoint eller vy för salonger
        const res = await fetchJson("/api/Theater");
        setTheaters(res || []);
      } catch (err) {
        console.error("Fel vid hämtning av salonger:", err);
        setError("Kunde inte ladda salonger.");
      } finally {
        setLoading(false);
      }
    };

    loadTheaters();
  }, []);

  return (
    <section className="bg-[#222] p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold text-white mb-4">
        Salonger
      </h2>

      {loading && <p className="text-gray-400">Laddar salonger...</p>}
      {error && <p className="text-red-400">{error}</p>}

      {!loading && !error && (
        <ul className="flex flex-col gap-3">
          {theaters.map((t: any) => (
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
                  {t.seatsPerRow.reduce((a: number, b: number) => a + b, 0)}
                </p>

                <p className="text-sm text-gray-400">
                  Layout: {t.seatsPerRow.join(", ")}
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
        Lägg till salong
      </button>
    </section>
  );
}
