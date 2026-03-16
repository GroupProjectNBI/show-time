import { useState } from "react";
import fetchJson from "../../utils/fetchJson";

export default function UserModal({ user, onClose, onSaved }: any) {
  const isEdit = Boolean(user);

  const [firstName, setFirstName] = useState(user?.firstName || "");
  const [lastName, setLastName] = useState(user?.lastName || "");
  const [email, setEmail] = useState(user?.email || "");
  const [role, setRole] = useState(user?.role || "User");

  const handleSubmit = async () => {
    const payload = { firstName, lastName, email, role };

    if (isEdit) {
      await fetchJson(`/api/User/${user.id}`, {
        method: "PUT",
        body: JSON.stringify(payload),
      });
    } else {
      await fetchJson("/api/User", {
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
          {isEdit ? "Redigera användare" : "Lägg till användare"}
        </h3>

        <div className="flex flex-col gap-3">
          <input
            className="p-2 rounded bg-[#333] text-white"
            placeholder="Förnamn"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
          />

          <input
            className="p-2 rounded bg-[#333] text-white"
            placeholder="Efternamn"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
          />

          <input
            className="p-2 rounded bg-[#333] text-white"
            placeholder="E‑post"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <select
            className="p-2 rounded bg-[#333] text-white"
            value={role}
            onChange={(e) => setRole(e.target.value)}
          >
            <option value="User">User</option>
            <option value="Staff">Staff</option>
            <option value="Admin">Admin</option>
          </select>
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
