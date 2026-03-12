import { useEffect, useState } from "react";
import fetchJson from "../../utils/fetchJson";

export default function AdminStaff() {
  const [staff, setStaff] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadStaff = async () => {
      try {
        // MVP: vi antar att du har en endpoint för personal
        const res = await fetchJson("/api/Staff");
        setStaff(res || []);
      } catch (err) {
        console.error("Fel vid hämtning av personal:", err);
        setError("Kunde inte ladda personal.");
      } finally {
        setLoading(false);
      }
    };

    loadStaff();
  }, []);

  return (
    <section className="bg-[#222] p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold text-white mb-4">
        Personal
      </h2>

      {loading && <p className="text-gray-400">Laddar personal...</p>}
      {error && <p className="text-red-400">{error}</p>}

      {!loading && !error && (
        <ul className="flex flex-col gap-3">
          {staff.map((s: any) => (
            <li
              key={s.id}
              className="flex justify-between items-center bg-[#1a1a1a] p-3 rounded"
            >
              <div className="text-white">
                <p className="font-semibold">
                  {s.firstName} {s.lastName}
                </p>

                <p className="text-sm text-gray-400">
                  {s.email}
                </p>

                <p className="text-sm text-gray-400">
                  Roll: {s.role}
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
        Lägg till personal
      </button>
    </section>
  );
}
