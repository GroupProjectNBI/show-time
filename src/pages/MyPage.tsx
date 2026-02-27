import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import fetchJson from "../utils/fetchJson";

import ChangePasswordForm from "../parts/ChangePasswordForm";
import UpcomingBookingCard from "../parts/UpcomingBookingCard";
import PastBookingCard from "../parts/PastBookingCard";


import AvatarSection from "../parts/AvatarSection";
import UsernameField from "../parts/UsernameField";
import EmailField from "../parts/EmailField";
//import PasswordDisplay from "../parts/PasswordDisplay"; // används denna? 
import AccountActions from "../parts/AccountActions";

import ProtectedRoute from "../parts/ProtectedRoute";

interface AvatarItem {
  id: number;
  url: string;
}

export default function MyPage() {
  const { user, changePassword, logout, updateAvatar } = useAuth();


  const bookings: any[] = [];

  const [avatarList, setAvatarList] = useState<AvatarItem[]>([]);

  // När MyPage laddas hämtas alla tillgängliga avatars från backend.
  // Detta gör att vi slipper hårdkoda bilder i frontend.
  // Både login och avatar-väljaren använder nu samma datakälla (databasen).
  useEffect(() => {
    async function loadAvatars() {
      try {
        const res = await fetchJson("/api/Avatar");

        // Förväntar oss array: [{ id: number, url: string }, ...]
        if (Array.isArray(res)) {
          const mapped: AvatarItem[] = res
            .filter((a) => a && typeof a.id === "number" && typeof a.url === "string")
            .map((a) => ({ id: a.id, url: a.url }));

          setAvatarList(mapped);
        } else {
          setAvatarList([]);
        }
      } catch (err) {
        console.error("Kunde inte hämta avatars:", err);
        setAvatarList([]);
      }
    }

    loadAvatars();
  }, []);

  // Om avatar-listan inte hunnit laddas men användaren redan har en avatar från login,
  // avatar läggs in den temporärt så UI inte visar trasig bild. 
  // Gör sidan mer stabil vid första render.
  const safeAvatarList: AvatarItem[] =
    avatarList.length > 0
      ? avatarList
      : user?.avatar && typeof user.avatarUrl === "number"
        ? [{ id: user.avatarUrl, url: user.avatar }]
        : [];

  return (
    <div className="max-w-5xl mx-auto mt-32 px-4 pb-20 text-accent">
      <h1 className="text-4xl font-bold mb-10 text-center">Min sida</h1>


      {/* ---------------- TWO COLUMN LAYOUT ---------------- */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        {/* -------- LEFT COLUMN -------- */}
        <div>
          <UsernameField
            initialValue={user?.userName ?? ""}
            onSave={(newName) => {
              console.log("Spara nytt användarnamn:", newName);
            }}
          />

          <EmailField
            initialValue={user?.email ?? ""}
            onSave={(newEmail) => {
              console.log("Spara ny email:", newEmail);
            }}
          />

          <div className="mt-6">
            <ChangePasswordForm onSubmit={changePassword} />
          </div>
        </div>

        {/* -------- RIGHT COLUMN -------- */}
        <div className="flex justify-center md:justify-end">
          <AvatarSection
            currentAvatarId={user?.avatarUrl ?? 1}
            avatars={safeAvatarList}
            onChange={async (newId) => {
              await updateAvatar(newId);
            }}
          />
        </div>
      </div>

      {/* ---------------- BOOKINGS ----------------göra denna dynamisk */}
      <h2 className="text-2xl font-semibold mt-16 mb-4">Kommande bokningar</h2>

      {bookings.length === 0 && (
        <p className="text-accent/60 mb-6">Du har inga kommande bokningar</p>
      )}

      <UpcomingBookingCard
        title="Dune: Messiah"
        dateLabel="Lör 14 mars 2026"
        timeLabel="19:30"
        theaterLabel="Stora salongen"
        ticketsLabel="2 biljetter"
        seatsLabel="A5, A6"
        onCancel={() => console.log("Avboka bokning")}
        cancelDisabled={false}
      />
      
      {/* -------- DIVIDER MELLAN SEKTIONERNA -------- */}
      <div className="my-10 h-px bg-white/10" /> 


      {/* -------- HISTORISKA BOKNINGAR -------- */}
      <h2 className="text-2xl font-semibold mt-0 mb-4">
        Tidigare bokningar
      </h2>

      <PastBookingCard
        title="Dune: Messiah"
        dateLabel="Lör 14 mars 2026"
        timeLabel="19:30"
        theaterLabel="Stora salongen"
        ticketsLabel="2 biljetter"
        seatsLabel="A5, A6"
        seenLabel="Sågs 14 mars 2026"
      />
   

      <AccountActions onLogout={() => { void logout(); }} />
    </div>
  );
}



MyPage.route = {
  path: "/min-sida",
  index: 99,
  menuLabel: null,
  element: (
    <ProtectedRoute>
      <MyPage />
    </ProtectedRoute>
  )
};
