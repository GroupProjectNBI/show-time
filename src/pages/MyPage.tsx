import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import fetchJson from "../utils/fetchJson";
import { formatScreeningDate } from "../utils/formatTime";

import ChangePasswordForm from "../parts/ChangePasswordForm";
import UpcomingBookingCard from "../parts/UpcomingBookingCard";
import PastBookingCard from "../parts/PastBookingCard";
import AvatarSection from "../parts/AvatarSection";
import UsernameField from "../parts/UsernameField";
import EmailField from "../parts/EmailField";
import AccountActions from "../parts/AccountActions";
import ProtectedRoute from "../parts/ProtectedRoute";

interface AvatarItem {
  id: number;
  url: string;
}

export default function MyPage() {
  const { user, changePassword, logout, updateAvatar } = useAuth();

  const [bookings, setBookings] = useState<any[]>([]);
  const [pastBookings, setPastBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [avatarList, setAvatarList] = useState<AvatarItem[]>([]);

  useEffect(() => {
    async function loadAvatars() {
      try {
        const res = await fetchJson("/api/Avatar");

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

  useEffect(() => {
    if (!user?.email) return;

    const loadBookings = async () => {
      try {
        setLoading(true);

        const result = await fetchJson("/api/v_user_bookings");

        if (result && !result.error) {
          const now = new Date();

          const mine = result.filter(
            (b: any) => b.email?.toLowerCase() === user.email.toLowerCase()
          );

          const myUpcoming = mine
            .filter((b: any) => new Date(b.startTime) >= now)
            .sort(
              (a: any, b: any) =>
                new Date(a.startTime).getTime() - new Date(b.startTime).getTime()
            );

          const myPast = mine
            .filter((b: any) => new Date(b.startTime) < now)
            .sort(
              (a: any, b: any) =>
                new Date(b.startTime).getTime() - new Date(a.startTime).getTime()
            );

          setBookings(myUpcoming);
          setPastBookings(myPast);
        }
      } catch (error) {
        console.error("Kunde inte hämta bokningar:", error);
      } finally {
        setLoading(false);
      }
    };

    loadBookings();
  }, [user?.email]);

  const handleCancelBooking = async (id: number) => {
    const confirmCancel = window.confirm("Är du säker på att du vill avboka denna film?");
    if (!confirmCancel) return;

    try {
      const ticketsData = await fetchJson(`/api/Ticket?where=BookingId=${id}`);

      if (ticketsData && ticketsData.length > 0) {
        for (const ticket of ticketsData) {
          await fetchJson(`/api/Ticket/${ticket.id}`, { method: "DELETE" });
        }
      }

      await fetchJson(`/api/Booking/${id}`, { method: "DELETE" });

      setBookings((prev) => prev.filter((b) => (b.bookingId || b.id) !== id));
      alert("Bokningen är nu avbokad.");
    } catch (error) {
      console.error("Fel vid avbokning:", error);
      alert("Kunde inte avboka. Vänligen försök igen.");
    }
  };

  const safeAvatarList: AvatarItem[] = avatarList.length > 0 ? avatarList : [];

  return (
    <div className="max-w-5xl mx-auto mt-32 px-4 pb-20 text-accent">
      <h1 className="text-4xl font-bold mb-10 text-center">Min sida</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        <div>
          <UsernameField
            initialValue={user?.userName ?? ""}
            onSave={(newName) => console.log("Spara nytt namn:", newName)}
          />

          <EmailField
            initialValue={user?.email ?? ""}
            onSave={(newEmail) => console.log("Spara ny email:", newEmail)}
          />

          <div className="mt-6">
            <ChangePasswordForm onSubmit={changePassword} />
          </div>
        </div>

        <div className="flex justify-center md:justify-end">
          <AvatarSection
            currentAvatarId={user?.avatarUrl ?? 1}
            avatars={safeAvatarList}
            onChange={async (newId) => {
              if (updateAvatar) await updateAvatar(newId);
            }}
          />
        </div>
      </div>

      <h2 className="text-2xl font-semibold mt-16 mb-6">Kommande bokningar</h2>

      {loading ? (
        <p className="text-accent/60 mb-6">Laddar dina bokningar...</p>
      ) : bookings.length === 0 ? (
        <p className="text-accent/60 mb-6">Du har inga kommande bokningar</p>
      ) : (
        <div className="flex flex-col gap-4 mb-10">
          {bookings.map((booking) => (
            <UpcomingBookingCard
              key={booking.bookingId || booking.id}
              id={booking.bookingId || booking.id}
              movieId={booking.movieId}
              title={booking.movieTitle}
              dateLabel={
                booking.startTime
                  ? formatScreeningDate(booking.startTime)
                  : "Okänt datum"
              }
              timeLabel={new Date(booking.startTime).toLocaleTimeString("sv-SE", {
                hour: "2-digit",
                minute: "2-digit",
              })}
              theaterLabel={booking.theaterName + " salongen"}
              ticketsLabel={`${booking.ticketCount || 0} biljetter`}
              seatsLabel={booking.seats || "Information saknas"}
              onCancel={handleCancelBooking}
              cancelDisabled={false}
            />
          ))}
        </div>
      )}

      <div className="my-10 h-px bg-white/10" />

      <h2 className="text-2xl font-semibold mt-0 mb-4">Tidigare bokningar</h2>

      {loading ? (
        <p className="text-accent/60">Laddar historik...</p>
      ) : pastBookings.length === 0 ? (
        <p className="text-accent/60 mb-6">Du har inga tidigare bokningar</p>
      ) : (
        <div className="flex flex-col gap-4 mb-10">
          {pastBookings.map((booking) => (
            <PastBookingCard
              key={booking.bookingId || booking.id}
              movieId={booking.movieId}
              title={booking.movieTitle}
              dateLabel={
                booking.startTime
                  ? formatScreeningDate(booking.startTime)
                  : "Okänt datum"
              }
              timeLabel={new Date(booking.startTime).toLocaleTimeString("sv-SE", {
                hour: "2-digit",
                minute: "2-digit",
              })}
              theaterLabel={booking.theaterName + " salongen"}
              ticketsLabel={`${booking.ticketCount || 0} biljetter`}
              seatsLabel={booking.seats || "Information saknas"}
              seenLabel={`Sågs ${new Date(booking.startTime).toLocaleDateString("sv-SE", {
                day: "numeric",
                month: "long",
                year: "numeric",
              })}`}
            />
          ))}
        </div>
      )}

      <div className="mt-12">
        <AccountActions onLogout={() => void logout()} />
      </div>
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
  ),
};