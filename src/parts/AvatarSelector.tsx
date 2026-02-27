import React from "react";

interface Avatar {
    id: number;
    url: string;
}

interface AvatarSelectorProps {
    avatars: Avatar[];
    selectedId: number;
    onSelect: (id: number) => void;
}

// AvatarSelector visar alla tillgängliga profilbilder i en grid.
// skickar bara tillbaka vilket avatar-id användaren klickade på.
// Själva sparandet sker i (AvatarSection/MyPage/AuthContext)
export default function AvatarSelector({
    avatars,
    selectedId,
    onSelect
}: AvatarSelectorProps) {
    return (
        <div className="grid grid-cols-4 gap-3 sm:grid-cols-6 sm:gap-4">
            {avatars.map((avatar) => {
                const isSelected = avatar.id === selectedId;

                return (
                    <button
                        key={avatar.id}
                        type="button"
                        // När en avatar klickas skickas id tillbaka till AvatarSection.
                        // Uppdaterar bara förhandsvalet (inte databasen än).
                        onClick={() => onSelect(avatar.id)}
                        className={`
              rounded-2xl p-2 border transition
              active:scale-[0.98]
              ${isSelected ? "border-white/70 bg-white/10" : "border-white/10 hover:bg-white/5"}
            `}
                        aria-label={`Välj avatar ${avatar.id}`}
                    >
                        <img
                            src={avatar.url}
                            alt={`Avatar ${avatar.id}`}
                            className="w-14 h-14 sm:w-16 sm:h-16 rounded-full mx-auto"
                        />
                    </button>
                );
            })}
        </div>
    );
}