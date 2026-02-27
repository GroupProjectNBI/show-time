import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import fetchJson from "../utils/fetchJson";
import ChangePasswordForm from "../parts/ChangePasswordForm";
import UpcomingBookingCard from "../parts/UpcomingBookingCard";
import { formatScreeningDate } from "../utils/formatTime";
import AvatarSection from "../parts/AvatarSection";
import UsernameField from "../parts/UsernameField";
import EmailField from "../parts/EmailField";
// import PasswordDisplay from "../parts/PasswordDisplay";
import AccountActions from "../parts/AccountActions";

const avatarList = [
  { id: 1, url: "/avatars/1.png" },
  { id: 2, url: "/avatars/2.png" },
  { id: 3, url: "/avatars/3.png" },
  { id: 4, url: "/avatars/4.png" },
];
export default function MyPage() {
  const { user, changePassword, logout } = useAuth();
  // State för bokningarna och laddning
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  // --- HÄMTA DATA ---
  useEffect(() => {
    async function fetchUserBookings() {
      // Om användaren inte är inloggad eller saknar email, avbryt.
      if (!user?.email) return;

      try {
        setLoading(true);
        // 1. Hämta alla bokningar för denna användare (via email)
        let alfa = "ceciliacavallin@hotmail.se";
        const userBookings = await fetchJson(`/api/Booking?where=email=${alfa}`);

        if (!userBookings || userBookings.length === 0) {
          setBookings([]);
          return;
        }

        // 2. Eftersom vi behöver filmtitel och platser, måste vi hämta detaljer för VARJE bokning
        const enrichedBookings = await Promise.all(
          userBookings.map(async (booking: any) => {
            const screeningId = booking.screeningId || booking.ScreeningId;

            const screeningData = await fetchJson(`/api/v_screenings?where=id=${screeningId}`);
            const screening = screeningData?.[0];

            const ticketsData = await fetchJson(`/api/Ticket?where=bookingId=${booking.id}`);

            // Här är den korrekta returen för varje bokning i loopen
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

        // Uppdatera statet med den kompletta datan
        setBookings(enrichedBookings);
      } catch (error) {
        console.error("Kunde inte hämta bokningar:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchUserBookings();
  }, [user]); // Körs igen om user ändras

  // const bookings: any[] = [];

  // --- AVBOKA FUNKTION ---
  const handleCancelBooking = async (id: number) => {
    try {
      console.log("Startar avbokning för bokning ID:", id);

      // 1. Hämta alla biljetter som tillhör denna bokning
      const ticketsData = await fetchJson(`/api/Ticket?where=BookingId=${id}`);

      // 2. Radera varje biljett EN OCH EN (Väntar på att varje radering blir klar)
      if (ticketsData && ticketsData.length > 0) {
        for (const ticket of ticketsData) {
          await fetchJson(`/api/Ticket/${ticket.id}`, {
            method: "DELETE"
          });
          console.log("Raderade biljett:", ticket.id);
        }
      }

      // 3. När ALLA biljetter är borta, radera själva bokningen.
      // Vi använder 'id' från funktionen, inte från ticketsData.
      await fetchJson(`/api/Booking/${id}`, {
        method: "DELETE"
      });
      console.log("Raderade bokning:", id);

      // 4. Uppdatera gränssnittet så att kortet försvinner direkt (Magi!)
      setBookings((prevBookings) => prevBookings.filter((b) => b.id !== id));

    } catch (error) {
      console.error("Fel vid avbokning:", error);
      alert("Kunde inte avboka. Vänligen försök igen."); // Enkel felhantering för användaren
    }
  };



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
            avatars={avatarList} // Nu skickar vi in den stabila listan!
            selectedId={user?.avatarUrl ?? 1}
            onSelect={(newId) => console.log("Byt avatar till:", newId)}
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
              id={booking.id} // Skickas med så avbokningen vet vilken som ska bort
              title={booking.movieTitle}
              // formatScreeningDate returnerar hela datum/tid-strängen, så vi kan behöva dela upp den,
              // eller bara lägga den i dateLabel om ni inte har en specifik format-funktion för tid
              dateLabel={booking.startTime ? formatScreeningDate(booking.startTime) : "Okänt datum"}
              timeLabel={""} // Om du vill bryta ut tiden separat, annars lämna tom 
              theaterLabel={booking.theaterName}
              ticketsLabel={`${booking.ticketCount} biljetter`}
              seatsLabel={booking.seats}
              onCancel={handleCancelBooking}
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

