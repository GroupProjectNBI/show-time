import { useEffect, useState } from "react";
import fetchJson from "../../utils/fetchJson";

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadUsers = async () => {
      try {
        // MVP: vi antar att du har en endpoint eller vy för användare
        const res = await fetchJson("/api/User");
        setUsers(res || []);
      } catch (err) {
        console.error("Fel vid hämtning av användare:", err);
        setError("Kunde inte ladda användare.");
      } finally {
        setLoading(false);
      }
    };

    loadUsers();
  }, []);

  return (
    <section className="bg-[#222] p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold text-white mb-4">
        Användare
      </h2>

      {loading && <p className="text-gray-400">Laddar användare...</p>}
      {error && <p className="text-red-400">{error}</p>}

      {!loading && !error && (
        <ul className="flex flex-col gap-3">
          {users.map((u: any) => (
            <li
              key={u.id}
              className="flex justify-between items-center bg-[#1a1a1a] p-3 rounded"
            >
              <div className="text-white">
                <p className="font-semibold">
                  {u.firstName} {u.lastName}
                </p>

                <p className="text-sm text-gray-400">
                  {u.email}
                </p>

                <p className="text-sm text-gray-400">
                  Medlem sedan: {u.createdAtFormatted || "—"}
                </p>

                <p className="text-sm text-gray-400">
                  Roll: {u.role || "User"}
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
        Lägg till användare
      </button>
    </section>
  );
}
