import { useState } from "react";
import fetchJson from "../../utils/fetchJson";

export default function MovieModal({ movie, onClose, onSaved }: any) {
  const isEdit = Boolean(movie);

  const [title, setTitle] = useState(movie?.title || "");
  const [description, setDescription] = useState(movie?.description || "");
  const [duration, setDuration] = useState(movie?.duration || 90);
  const [ageLimit, setAgeLimit] = useState(movie?.ageLimit || 7);
  const [categories, setCategories] = useState(movie?.categories || "");
  const [posterUrl, setPosterUrl] = useState(movie?.posterUrl || "");

  const handleSubmit = async () => {
    const payload = {
      title,
      description,
      duration: Number(duration),
      ageLimit: Number(ageLimit),
      categories,
      posterUrl,
    };

    if (isEdit) {
      await fetchJson(`/api/Movie/${movie.id}`, {
        method: "PUT",
        body: JSON.stringify(payload),
      });
    } else {
      await fetchJson("/api/Movie", {
        method: "POST",
        body: JSON.stringify(payload),
      });
    }

    onSaved();
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
      <div className="bg-[#1a1a1a] p-6 rounded-lg w-full max-w-lg">
        <h3 className="text-xl text-white font-semibold mb-4">
          {isEdit ? "Redigera film" : "Lägg till film"}
        </h3>

        <div className="flex flex-col gap-3">
          <input
            className="p-2 rounded bg-[#333] text-white"
            placeholder="Titel"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />

          <textarea
            className="p-2 rounded bg-[#333] text-white h-24"
            placeholder="Beskrivning"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />

          <input
            className="p-2 rounded bg-[#333] text-white"
            type="number"
            placeholder="Längd (minuter)"
            value={duration}
            onChange={(e) => setDuration(e.target.value)}
          />

          <input
            className="p-2 rounded bg-[#333] text-white"
            type="number"
            placeholder="Åldersgräns"
            value={ageLimit}
            onChange={(e) => setAgeLimit(e.target.value)}
          />

          <input
            className="p-2 rounded bg-[#333] text-white"
            placeholder="Kategorier (t.ex. Action, Drama)"
            value={categories}
            onChange={(e) => setCategories(e.target.value)}
          />

          <input
            className="p-2 rounded bg-[#333] text-white"
            placeholder="Poster URL"
            value={posterUrl}
            onChange={(e) => setPosterUrl(e.target.value)}
          />
        </div>

        <div className="flex justify-end gap-3 mt-6">
          <button
            onClick={onClose}
            className="text-gray-300 hover:underline"
          >
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
