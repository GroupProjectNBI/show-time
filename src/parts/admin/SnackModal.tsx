import { useState } from "react";
import fetchJson from "../../utils/fetchJson";

export default function SnackModal({ item, onClose, onSaved }: any) {
  const isEdit = Boolean(item);

  const [name, setName] = useState(item?.name || "");
  const [price, setPrice] = useState(item?.price || 0);
  const [category, setCategory] = useState(item?.category || "Snacks");

  const handleSubmit = async () => {
    const payload = { name, price: Number(price), category };

    if (isEdit) {
      await fetchJson(`/api/SnackMenu/${item.id}`, {
        method: "PUT",
        body: JSON.stringify(payload),
      });
    } else {
      await fetchJson("/api/SnackMenu", {
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
          {isEdit ? "Redigera menyobjekt" : "Lägg till menyobjekt"}
        </h3>

        <div className="flex flex-col gap-3">
          <input
            className="p-2 rounded bg-[#333] text-white"
            placeholder="Namn"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          <input
            className="p-2 rounded bg-[#333] text-white"
            placeholder="Pris"
            type="number"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
          />

          <select
            className="p-2 rounded bg-[#333] text-white"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            <option value="Snacks">Snacks</option>
            <option value="Dryck">Dryck</option>
            <option value="Godis">Godis</option>
            <option value="Popcorn">Popcorn</option>
            <option value="Meny">Meny</option>
          </select>
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
