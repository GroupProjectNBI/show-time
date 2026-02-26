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
  // för att bygget inte ska klaga över att funktionerna inte används så loggar vi bara dom så länge :
  console.log(startEditing);
  console.log(cancelEditing);
  console.log(confirmEditing);


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
            w-full rounded-xl bg-white/10 border border-white/20 px-4 py-2 text-accent placeholder-accent/40 focus:outline-none
            ${editing ? "opacity-100" : "opacity-60 cursor-not-allowed"}
          `}
        />
      </div>
    </div>
  );
}
