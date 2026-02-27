import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import fetchJson from "../utils/fetchJson";

import ChangePasswordForm from "../parts/ChangePasswordForm";
import UpcomingBookingCard from "../parts/UpcomingBookingCard";
import { formatScreeningDate } from "../utils/formatTime";
import AvatarSection from "../parts/AvatarSection";
import UsernameField from "../parts/UsernameField";
import EmailField from "../parts/EmailField";
import AccountActions from "../parts/AccountActions";
import ProtectedRoute from "../parts/ProtectedRoute";

// Typ för avatarer (från dev-branchen)
interface AvatarItem {
  id: number;
  url: string;
}

export default function MyPage() {
  const { user, changePassword, logout, updateAvatar } = useAuth();

  // --- STATES ---
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [avatarList, setAvatarList] = useState<AvatarItem[]>([]);

  // 1. --- HÄMTA AVATARER ---
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

  // 2. --- HÄMTA BOKNINGAR ---
  useEffect(() => {
    async function fetchUserBookings() {
      if (!user?.email) return;

      try {
        setLoading(true);
        const userBookings = await fetchJson(`/api/Booking?where=email=${user.email}`);

        if (!userBookings || userBookings.length === 0) {
          setBookings([]);
          return;
        }

        const enrichedBookings = await Promise.all(
          userBookings.map(async (booking: any) => {
            const screeningId = booking.screeningId || booking.ScreeningId;

            const screeningData = await fetchJson(`/api/v_screenings?where=id=${screeningId}`);
            const screening = screeningData?.[0];

            const ticketsData = await fetchJson(`/api/Ticket?where=bookingId=${booking.id}`);

            return {
              ...booking,
              movieTitle: screening?.movieTitle || "Okänd film",
              startTime: screening?.startTime,
              theaterName: screening?.theaterName || "Okänd salong",
              ticketCount: ticketsData?.length || 0,
              seats: ticketsData?.map((t: any) => t.seatId).join(", ") || "-"
            };
          })
        );

        setBookings(enrichedBookings);
      } catch (error) {
        console.error("Kunde inte hämta bokningar:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchUserBookings();
  }, [user]);

  // 3. --- AVBOKA FUNKTION ---
  const handleCancelBooking = async (id: number) => {
    try {
      console.log("Startar avbokning för bokning ID:", id);

      const ticketsData = await fetchJson(`/api/Ticket?where=BookingId=${id}`);

      if (ticketsData && ticketsData.length > 0) {
        for (const ticket of ticketsData) {
          await fetchJson(`/api/Ticket/${ticket.id}`, {
            method: "DELETE"
          });
          console.log("Raderade biljett:", ticket.id);
        }
      }

      await fetchJson(`/api/Booking/${id}`, {
        method: "DELETE"
      });

      console.log("Raderade bokning:", id);
      setBookings((prevBookings) => prevBookings.filter((b) => b.id !== id));

    } catch (error) {
      console.error("Fel vid avbokning:", error);
      alert("Kunde inte avboka. Vänligen försök igen.");
    }
  };

  // Säker avatarlista ifall databasen är långsam
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
            onSave={(newName) => console.log("Spara nytt användarnamn:", newName)}
          />
          <EmailField
            initialValue={user?.email ?? ""}
            onSave={(newEmail) => console.log("Spara ny email:", newEmail)}
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
              if (updateAvatar) {
                await updateAvatar(newId);
              }
            }}
          />
        </div>
      </div>

      {/* ---------------- BOOKINGS ---------------- */}
      <h2 className="text-2xl font-semibold mt-16 mb-4">Kommande bokningar</h2>

      {loading ? (
        <p className="text-accent/60 mb-6">Laddar dina bokningar...</p>
      ) : bookings.length === 0 ? (
        <p className="text-accent/60 mb-6">Du har inga kommande bokningar</p>
      ) : (
        <div className="flex flex-col gap-4">
          {bookings.map((booking) => (
            <UpcomingBookingCard
              key={booking.id}
              id={booking.id}
              title={booking.movieTitle}
              dateLabel={booking.startTime ? formatScreeningDate(booking.startTime) : "Okänt datum"}
              timeLabel={""}
              theaterLabel={booking.theaterName}
              ticketsLabel={`${booking.ticketCount} biljetter`}
              seatsLabel={booking.seats}
              onCancel={handleCancelBooking}
              cancelDisabled={false}
            />
          ))}
        </div>
      )}

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