import { useEffect, useState } from "react";
import fetchJson from "../../utils/fetchJson";

export default function AdminBookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadBookings = async () => {
      try {
        // Hämtar bokningar + screening info via view
        const res = await fetchJson("/api/v_bookings_admin");
        setBookings(res || []);
      } catch (err) {
        console.error("Fel vid hämtning av bokningar:", err);
        setError("Kunde inte ladda bokningar.");
      } finally {
        setLoading(false);
      }
    };

    loadBookings();
  }, []);

  return (
    <section className="bg-[#222] p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold text-white mb-4">
        Bokningar
      </h2>

      {loading && <p className="text-gray-400">Laddar bokningar...</p>}
      {error && <p className="text-red-400">{error}</p>}

      {!loading && !error && (
        <ul className="flex flex-col gap-3">
          {bookings.map((b: any) => (
            <li
              key={b.id}
              className="flex justify-between items-center bg-[#1a1a1a] p-3 rounded"
            >
              <div className="text-white">
                <p className="font-semibold">
                  {b.movieTitle}
                </p>
                <p className="text-sm text-gray-400">
                  {b.startTimeFormatted}
                </p>
                <p className="text-sm text-gray-400">
                  Ref: {b.bookingRef} • {b.email}
                </p>
                <p className="text-sm text-gray-400">
                  Biljetter: {b.ticketCount}
                </p>
              </div>

              <div className="flex gap-3">
                <button className="text-blue-400 hover:underline">
                  Visa
                </button>
                <button className="text-red-400 hover:underline">
                  Ta bort
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
