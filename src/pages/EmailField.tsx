import { useState } from "react";

interface EmailFieldProps {
  initialValue: string;
  onSave: (newEmail: string) => void;
}

export default function EmailField({ initialValue, onSave }: EmailFieldProps) {
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
      <p className="text-sm text-accent/60 mb-1">Email</p>

      <div className="flex items-center gap-3">
        {/* INPUT */}
        <input
          type="email"
          value={editing ? draft : value}
          disabled={!editing}
          onChange={(e) => setDraft(e.target.value)}
          className={`
            bg-black/20 border border-white/20 px-3 py-2 rounded w-full
            transition
            ${editing ? "opacity-100" : "opacity-60 cursor-not-allowed"}
          `}
        />
      </div>
    </div>
  );
}
