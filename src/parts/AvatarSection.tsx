// parts/AvatarSection.tsx
import { useState } from "react";
import AvatarSelector from "./AvatarSelector";

interface Avatar {
  id: number;
  url: string;
}

interface Props {
  currentAvatarId: number;
  avatars: Avatar[];
  onChange: (id: number) => void;
}

export default function AvatarSection({ currentAvatarId, avatars, onChange }: Props) {
  const [open, setOpen] = useState(false);

  const currentAvatar = avatars.find(a => a.id === currentAvatarId);

  return (
    <div className="mb-12">
      <h2 className="text-2xl font-semibold mb-4">Profilbild</h2>

      <div className="flex items-center gap-6">
        <img
          src={currentAvatar?.url}
          alt="Avatar"
          className="w-24 h-24 rounded-full border border-white/20"
        />

        <button
          onClick={() => setOpen(!open)}
          className="px-4 py-2 rounded-full border border-white/20 hover:bg-white/10 transition"
        >
          Byt avatar
        </button>
      </div>

      {open && (
        <div className="mt-6">
          <AvatarSelector
            avatars={avatars}
            selectedId={currentAvatarId}
            onSelect={(id) => {
              onChange(id);
              setOpen(false);
            }}
          />
        </div>
      )}
    </div>
  );
}
