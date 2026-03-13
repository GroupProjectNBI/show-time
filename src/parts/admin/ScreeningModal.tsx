import { useEffect, useState } from "react";
import fetchJson from "../../utils/fetchJson";

export default function ScreeningModal({ screening, onClose, onSaved }: any) {
  const isEdit = Boolean(screening);

  const [movies, setMovies] = useState([]);
  const [theaters, setTheaters] = useState([]);

  const [movieId, setMovieId] = useState(screening?.movieId || "");
  const [theaterId, setTheaterId] = useState(screening?.theaterId || "");
  const [startTime, setStartTime] = useState(
    screening?.startTime?.slice(0, 16) || ""
  );

  useEffect(() => {
    const load = async () => {
      const m = await fetchJson("/api/Movie");
      const t = await fetchJson("/api/Theater");
      setMovies(m || []);
      setTheaters(t || []);
    };
    load();
  }, []);

  const handleSubmit = async () => {
    const payload = {
      movieId: Number(movieId),
      theaterId: Number(theaterId),
      startTime: new Date(startTime).toISOString(),
    };

    if (isEdit) {
      await fetchJson(`/api/Screening/${screening.id}`, {
        method: "PUT",
        body: JSON.stringify(payload),
      });
    } else {
      await fetchJson("/api/Screening", {
        method: "POST",
        body: JSON.stringify(payload),
      });
    }

    onSaved();
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
      <div className="bg-[#1a1a1a] p-6 rounded-lg w-full max-w-md">
        <h3 className="text-xl text-white font-semibold mb-4">
          {isEdit ? "Redigera visning" : "Lägg till visning"}
        </h3>

        <div className="flex flex-col gap-3">
          <select
            className="p-2 rounded bg-[#333] text-white"
            value={movieId}
            onChange={(e) => setMovieId(e.target.value)}
          >
            <option value="">Välj film</option>
            {movies.map((m: any) => (
              <option key={m.id} value={m.id}>
                {m.title}
              </option>
            ))}
          </select>

          <select
            className="p-2 rounded bg-[#333] text-white"
            value={theaterId}
            onChange={(e) => setTheaterId(e.target.value)}
          >
            <option value="">Välj salong</option>
            {theaters.map((t: any) => (
              <option key={t.id} value={t.id}>
                {t.name}
              </option>
            ))}
          </select>

          <input
            type="datetime-local"
            className="p-2 rounded bg-[#333] text-white"
            value={startTime}
            onChange={(e) => setStartTime(e.target.value)}
          />
        </div>

        <div className="flex justify-end gap-3 mt-6">
          <button onClick={onClose} className="text-gray-300 hover:underline">
            Avbryt
          </button>

          <button
            onClick={handleSubmit}
            className="bg-primary text-black px-4 py-2 rounded font-semibold"
          >
            Spara
          </button>
        </div>
      </div>
    </div>
  );
}
