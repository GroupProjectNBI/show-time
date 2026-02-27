import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import fetchJson from "../utils/fetchJson";

import ChangePasswordForm from "../parts/ChangePasswordForm";
import UpcomingBookingCard from "../parts/UpcomingBookingCard";

import AvatarSection from "../parts/AvatarSection";
import UsernameField from "../parts/UsernameField";
import EmailField from "../parts/EmailField";
//import PasswordDisplay from "../parts/PasswordDisplay"; // används denna? 
import AccountActions from "../parts/AccountActions";
import { useEffect, useState } from "react";
import fetchJson from "../utils/fetchJson";

 //

interface AvatarItem {
  id: number;
  url: string;
}

export default function MyPage() {
  const { user, changePassword, logout, updateAvatar } = useAuth();


  const [bookings, setBookings] = useState<any[]>([]);

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
  // LOGIK #310: Hämta bokningar baserat på e-post
useEffect(() => {
    if (!user?.email) return;

    const loadBookings = async () => {
      try {
        // Vi hämtar datan från VIEW
        const result = await fetchJson(`/api/v_user_bookings`);
        console.log("Hämtade bokningar:", result);
        if (result && !result.error) {
          const now = new Date();

          // Filtrera fram inloggad användares framtida bokningar
          const myUpcoming = result
            .filter((b: any) => b.email?.toLowerCase() === user.email.toLowerCase())
            .filter((b: any) => new Date(b.startTime) >= now);

          // Sortera listan
          myUpcoming.sort((a: any, b: any) => 
            new Date(a.startTime).getTime() - new Date(b.startTime).getTime()
          );

          setBookings(myUpcoming);
        }
      } catch (error) {
        console.error("Kunde inte hämta bokningar:", error);
      }
    };

    loadBookings();
  }, [user?.email]);

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

{/* ---------------- BOOKINGS SECTION #310 ---------------- */}
      <h2 className="text-2xl font-semibold mt-16 mb-6">Kommande bokningar</h2>

      {/* Om inga bokningar finns */}
      {bookings.length === 0 ? (
        <p className="text-accent/60 mb-6">Du har inga kommande bokningar</p>
      ) : (
        /* Lista med riktiga bokningar från databasen */
        <div className="flex flex-col gap-4 mb-10">
          {bookings.map((booking) => (
            <UpcomingBookingCard
              key={booking.bookingId || booking.id}
              title={booking.movieTitle}
              dateLabel={new Date(booking.startTime).toLocaleDateString('sv-SE', { 
                weekday: 'short', 
                day: 'numeric', 
                month: 'long' 
              })}
              timeLabel={new Date(booking.startTime).toLocaleTimeString('sv-SE', { 
                hour: '2-digit', 
                minute: '2-digit' 
              })}
              theaterLabel={booking.theaterName + " salongen"}
              ticketsLabel={`${booking.ticketCount || 0} biljetter`}
              seatsLabel={booking.seats || "Information saknas"}
              onCancel={() => console.log("Avboka bokning:", booking.id)}
              cancelDisabled={false}
            />
          ))}
        </div>
      )}

      <AccountActions onLogout={() => { void logout(); }} />
    </div>
  );
}

import ProtectedRoute from "../parts/ProtectedRoute";

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
