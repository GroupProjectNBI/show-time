import { useState } from "react";
import fetchJson from "../../utils/fetchJson";

export default function TheaterModal({ theater, onClose, onSaved }: any) {
  const isEdit = Boolean(theater);

  const [name, setName] = useState(theater?.name || "");
  const [layout, setLayout] = useState(
    theater?.seatsPerRow.join(", ") || "10, 10, 10"
  );

  const handleSubmit = async () => {
    const seatsPerRow = layout
      .split(",")
      .map((n: string) => Number(n.trim()))
      .filter((n: number) => !isNaN(n) && n > 0);

    const payload = { name, seatsPerRow };

    if (isEdit) {
      await fetchJson(`/api/Theater/${theater.id}`, {
        method: "PUT",
        body: JSON.stringify(payload),
      });
    } else {
      await fetchJson("/api/Theater", {
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
          {isEdit ? "Redigera salong" : "Lägg till salong"}
        </h3>

        <div className="flex flex-col gap-3">
          <input
            className="p-2 rounded bg-[#333] text-white"
            placeholder="Salongsnamn"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          <input
            className="p-2 rounded bg-[#333] text-white"
            placeholder="Layout (t.ex. 10, 12, 12, 10)"
            value={layout}
            onChange={(e) => setLayout(e.target.value)}
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
