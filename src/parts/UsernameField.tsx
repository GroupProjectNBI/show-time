import { useState } from "react";

interface UsernameFieldProps {
  initialValue: string;
  onSave: (newName: string) => void;
}

export default function UsernameField({ initialValue, onSave }: UsernameFieldProps) {
  const [editing, setEditing] = useState(false);
  const [value, setValue] = useState(initialValue);
  const [draft, setDraft] = useState(initialValue);

  const startEditing = () => {
    setDraft(value);
    setEditing(true);
  };

  const cancelEditing = () => {
    setDraft(value);
    setEditing(false);
  };

  const confirmEditing = () => {
    setValue(draft);
    onSave(draft);
    setEditing(false);
  };

  return (
    <div className="mb-8">
      <p className="text-sm text-accent/60 mb-1">Användarnamn</p>

      <div className="flex items-center gap-3">
        {/* INPUT */}
        <input
          type="text"
          value={editing ? draft : value}
          disabled={!editing}
          onChange={(e) => setDraft(e.target.value)}
          className={`
            bg-black/20 border border-white/20 px-3 py-2 rounded w-full
            transition
            ${editing ? "opacity-100" : "opacity-60 cursor-not-allowed"}
          `}
        />

        {/* BUTTONS */}
        {!editing ? (
          <button
            onClick={startEditing}
            className="px-4 py-2 rounded-full border border-white/20 hover:bg-white/10 transition"
          >
            Byt
          </button>
        ) : (
          <div className="flex items-center gap-2">
            <button
              onClick={confirmEditing}
              className="px-4 py-2 rounded-full bg-green-600 text-white hover:bg-green-700 transition"
            >
              Bekräfta
            </button>

            <button
              onClick={cancelEditing}
              className="px-4 py-2 rounded-full border border-white/20 hover:bg-white/10 transition"
            >
              Avbryt
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
