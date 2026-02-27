import { useAuth } from "../context/AuthContext";
import ChangePasswordForm from "../parts/ChangePasswordForm";
import UpcomingBookingCard from "../parts/UpcomingBookingCard";

import AvatarSection from "../parts/AvatarSection";
import UsernameField from "../parts/UsernameField";
import EmailField from "../parts/EmailField";
import PasswordDisplay from "../parts/PasswordDisplay";
import AccountActions from "../parts/AccountActions";
import { useEffect, useState } from "react";
import fetchJson from "../utils/fetchJson";

 //

export default function MyPage() {
  const { user, changePassword, logout } = useAuth();

  const [bookings, setBookings] = useState<any[]>([]);

  const avatarList = [
    { id: 1, url: "/avatars/1.png" },
    { id: 2, url: "/avatars/2.png" },
    { id: 3, url: "/avatars/3.png" },
    { id: 4, url: "/avatars/4.png" },
  ];
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
            avatars={avatarList}
            onChange={(newId) => {
              console.log("Byt avatar till:", newId);
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

      <AccountActions onLogout={logout} />
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

