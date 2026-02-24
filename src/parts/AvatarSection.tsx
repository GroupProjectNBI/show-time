import { useState } from "react";
import AvatarSelector from "./AvatarSelector";

interface Avatar {
  id: number;
  url: string;
}

interface AvatarSectionProps {
  currentAvatarId: number;
  avatars: Avatar[];
  onChange: (id: number) => void;
}

export default function AvatarSection({
  currentAvatarId,
  avatars,
  onChange
}: AvatarSectionProps) {
  const [open, setOpen] = useState(false);
  const [previewId, setPreviewId] = useState<number>(currentAvatarId);
  const [zoom, setZoom] = useState(false);

  const currentAvatar = avatars.find(a => a.id === currentAvatarId);
  const previewAvatar = avatars.find(a => a.id === previewId);

  return (
    <div className="mb-12">
      <h2 className="text-2xl font-semibold mb-4">Profilbild</h2>

      {/* --- AVATAR + BYT KNAPP --- */}
      <div className="flex items-center gap-6">
        <img
          src={currentAvatar?.url}
          alt="Avatar"
          onClick={() => setZoom(true)}
          className="w-40 h-40 rounded-full border border-white/20 cursor-pointer hover:scale-105 transition"
        />

        <button
          onClick={() => setOpen(!open)}
          className="px-4 py-2 rounded-full border border-white/20 hover:bg-white/10 transition"
        >
          Byt avatar
        </button>
      </div>

      {/* --- ZOOM MODAL --- */}
      {zoom && (
        <div
          onClick={() => setZoom(false)}
          className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 cursor-pointer"
        >
          <img
            src={currentAvatar?.url}
            className="w-72 h-72 rounded-full border border-white/20 shadow-2xl"
          />
        </div>
      )}

      {/* --- UTFÄLLBAR AVATAR-PICKER --- */}
      {open && (
        <div className="mt-6 p-4 rounded-xl bg-white/5 border border-white/10">
          <AvatarSelector
            avatars={avatars}
            selectedId={previewId}
            onSelect={(id) => setPreviewId(id)}
          />

          {/* BEKRÄFTA-KNAPP */}
          <div className="flex justify-end mt-4">
            <button
              onClick={() => {
                onChange(previewId);
                setOpen(false);
              }}
              className="px-4 py-2 rounded-full bg-red-600 text-white font-semibold hover:bg-red-700 transition"
            >
              Bekräfta
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
