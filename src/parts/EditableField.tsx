import { useState } from "react";

interface EditableFieldProps {
  label: string;
  value: string;
  onSave: (newValue: string) => void;
}

export default function EditableField({ label, value, onSave }: EditableFieldProps) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(value);

  return (
    <div className="mb-6">
      <p className="text-sm text-accent/60">{label}</p>

      {!editing ? (
        <div className="flex items-center gap-3">
          <p className="text-lg">{value}</p>
          <button
            onClick={() => setEditing(true)}
            className="text-accent/60 hover:text-accent transition"
          >
            ✏️
          </button>
        </div>
      ) : (
        <div className="flex items-center gap-3">
          <input
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            className="bg-black/20 border border-white/20 px-3 py-1 rounded"
          />
          <button
            onClick={() => {
              onSave(draft);
              setEditing(false);
            }}
            className="text-green-400"
          >
            Spara
          </button>
          <button
            onClick={() => setEditing(false)}
            className="text-red-400"
          >
            Avbryt
          </button>
        </div>
      )}
    </div>
  );
}
