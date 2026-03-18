import { useEffect, useState } from "react";
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

  // previewId är en lokal förhandsvisning.
  // När användarens riktiga avatar ändras i Context,
  // uppdateraS previewId så att UI inte hamnar ur synk.
  // Annars kan gammal avatar visas trots att databasen är uppdaterad.
  useEffect(() => {
    setPreviewId(currentAvatarId);
  }, [currentAvatarId]);

  const currentAvatar = avatars.find(a => a.id === currentAvatarId);


  return (
    <div className="mb-12 w-full max-w-md">
      <h2 className="text-2xl font-semibold mb-4">Profilbild</h2>

      {/* --- AVATAR + BYT KNAPP --- */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6">
        <img
          src={currentAvatar?.url}
          alt="Avatar"
          onClick={() => setZoom(true)}
          className="w-28 h-28 sm:w-40 sm:h-40 rounded-full border border-white/20 cursor-pointer hover:scale-105 transition self-start"
        />

        <button
          onClick={() => setOpen(!open)}
          className="px-4 py-2 rounded-full border border-white/20 hover:bg-white/10 transition w-full sm:w-auto"
        >
          Byt avatar
        </button>
      </div>

      {/* --- ZOOM MODAL --- */}
      {zoom && (
        <div
          onClick={() => setZoom(false)}
          className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 cursor-pointer p-4"
        >
          <img
            src={currentAvatar?.url}
            alt="Avatar (zoom)"
            className="w-64 h-64 sm:w-72 sm:h-72 rounded-full border border-white/20 shadow-2xl"
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
              // Vald avatar skickas till Mypage via onChange (när användaren klickar bekräfta)
              //Mypage anropar updateAvatar() som sparas i databasen
              // Context updpateras och UI:t renderas im automatiskt
              onClick={() => {
                onChange(previewId);
                setOpen(false);
              }}
              className="px-4 py-2 rounded-full bg-red-600 text-white font-semibold hover:bg-red-700 transition w-full sm:w-auto"
            >
              Bekräfta
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
