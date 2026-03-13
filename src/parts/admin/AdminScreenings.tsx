import { useEffect, useState } from "react";
import fetchJson from "../../utils/fetchJson";

export default function AdminScreenings() {
  const [screenings, setScreenings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadScreenings = async () => {
      try {
        // MVP: vi antar att du har en vy som returnerar visningar
        const res = await fetchJson("/api/v_screenings_admin");
        setScreenings(res || []);
      } catch (err) {
        console.error("Fel vid hämtning av visningar:", err);
        setError("Kunde inte ladda visningar.");
      } finally {
        setLoading(false);
      }
    };

    loadScreenings();
  }, []);

  return (
    <section className="bg-[#222] p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold text-white mb-4">
        Visningar
      </h2>

      {loading && <p className="text-gray-400">Laddar visningar...</p>}
      {error && <p className="text-red-400">{error}</p>}

      {!loading && !error && (
        <ul className="flex flex-col gap-3">
          {screenings.map((s: any) => (
            <li
              key={s.id}
              className="flex justify-between items-center bg-[#1a1a1a] p-3 rounded"
            >
              <div className="text-white">
                <p className="font-semibold">{s.movieTitle}</p>
                <p className="text-sm text-gray-400">
                  {s.startTimeFormatted}
                </p>
                <p className="text-sm text-gray-400">
                  Salong: {s.theaterName}
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
        Lägg till visning
      </button>
    </section>
  );
}
