import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import fetchJson from "../utils/fetchJson";
import { formatScreeningDate } from "../utils/formatTime";
import toast from "react-hot-toast";

import ChangePasswordForm from "../parts/ChangePasswordForm";
import UpcomingBookingCard from "../parts/UpcomingBookingCard";
import PastBookingCard from "../parts/PastBookingCard";
import AvatarSection from "../parts/AvatarSection";
import UsernameField from "../parts/UsernameField";
import EmailField from "../parts/EmailField";
import AccountActions from "../parts/AccountActions";
import ProtectedRoute from "../parts/ProtectedRoute";
import { formatSeatString } from "../utils/seatCalculator";

interface AvatarItem {
  id: number;
  url: string;
}

export default function MyPage() {
  // Vi kombinerar de funktioner vi behöver från AuthContext
  const { user, changeUserName, logout, updateAvatar } = useAuth();

  const [bookings, setBookings] = useState<any[]>([]);
  const [pastBookings, setPastBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [avatarList, setAvatarList] = useState<AvatarItem[]>([]);

  // Hämta tillgängliga avatarer
  useEffect(() => {
    async function loadAvatars() {
      try {
        const res = await fetchJson("/api/Avatar");
        if (Array.isArray(res)) {
          const mapped: AvatarItem[] = res
            .filter((a) => a && typeof a.id === "number" && typeof a.url === "string")
            .map((a) => ({ id: a.id, url: a.url }));
          setAvatarList(mapped);
        }
      } catch (err) {
        toast.error("Kunde inte ladda profilbilder.");
      }
    }
    loadAvatars();
  }, []);

  // Hämta användarens bokningar
  useEffect(() => {
    if (!user?.email) return;

    const loadBookings = async () => {
      try {
        setLoading(true);
        const result = await fetchJson(`/api/v_user_bookings?where=email=${user.email.toLowerCase()}`);

        if (result && !result.error) {
          const now = new Date();

          const myUpcoming = result
            .filter((b: any) => new Date(b.startTime) >= now)
            .sort((a: any, b: any) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime());

          const myPast = result
            .filter((b: any) => new Date(b.startTime) < now)
            .sort((a: any, b: any) => new Date(b.startTime).getTime() - new Date(a.startTime).getTime());

          setBookings(myUpcoming);
          setPastBookings(myPast);
        }
      } catch (error) {
        toast.error("Kunde inte hämta dina bokningar.");
      } finally {
        setLoading(false);
      }
    };

    loadBookings();
  }, [user?.email]);

  // Avboka film
  const handleCancelBooking = async (id: number) => {
    const confirmCancel = window.confirm("Är du säker på att du vill avboka denna film?");
    if (!confirmCancel) return;

    const toastId = toast.loading("Avbokar...");
    try {
      const ticketsData = await fetchJson(`/api/Ticket?where=BookingId=${id}`);

      if (ticketsData && ticketsData.length > 0) {
        for (const ticket of ticketsData) {
          await fetchJson(`/api/Ticket/${ticket.id}`, { method: "DELETE" });
        }
      }

      await fetchJson(`/api/Booking/${id}`, { method: "DELETE" });

      setBookings((prev) => prev.filter((b) => (b.bookingId || b.id) !== id));
      toast.success("Bokningen är nu avbokad.", { id: toastId });
    } catch (error) {
      toast.error("Kunde inte avboka. Vänligen försök igen.", { id: toastId });
    }
  };

  // Lösenordsåterställning
  const handlePasswordReset = async (code: string, newPassword: string) => {
    if (!user?.email) return;

    const result = await fetchJson("/api/reset-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: user.email,
        code: code,
        newPassword: newPassword
      })
    });

    if (result && result.success) {
      return;
    } else {
      throw new Error(result?.error || "Ogiltig kod eller tekniskt fel.");
    }
  };

  const safeAvatarList: AvatarItem[] = avatarList.length > 0 ? avatarList : [];

  // Hantera när användaren betygsätter en tidigare sedd film
  const handleRateMovie = async (bookingId: number, movieId: number, rating: number, description: string) => {    // 1. (Optimistisk uppdatering) Fyll i stjärnorna direkt i gränssnittet
    // 1. (Optimistisk uppdatering) Fyll i stjärnorna
    setPastBookings((prev) =>
      prev.map((b) =>
        (b.bookingId || b.id) === bookingId ? { ...b, userRating: rating } : b
      )
    );




    // 3. TODO: Skicka till din backend när databasen har stöd för det!
    try {
      // 2. Skicka datan till databasen
      const result = await fetchJson("/api/Review", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          gradingOfStars: rating,
          // Om användaren inte skrev något, spara null eller en tom sträng
          description: description.trim() !== "" ? description : "Ingen kommentar",
          author: user?.userName || user?.email || "Anonym",
          movieId: movieId
        })
      });

      if (result && !result.error) {
        toast.success(`Du gav filmen ${rating} av 5 stjärnor! 🌟`);
      } else {
        throw new Error(result?.error || "Något gick fel vid sparningen.");
      }

    } catch (error) {
      console.error("Fel vid sparande av betyg:", error);
      toast.error("Kunde inte spara betyget.");

      // Ta bort stjärnorna igen om det misslyckades
      setPastBookings((prev) =>
        prev.map((b) =>
          (b.bookingId || b.id) === bookingId ? { ...b, userRating: undefined } : b
        )
      );
    }
  };



  return (
    <div className="max-w-5xl mx-auto mt-16 px-4 pb-20 text-accent">
      <h1 className="text-4xl font-bold mb-10 text-center uppercase italic tracking-tighter">Min sida</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-start">
        <div className="space-y-6">
          <UsernameField
            initialValue={user?.userName ?? ""}
            onSave={async (newName) => {
              await changeUserName?.(newName, "name");
              toast.success("Användarnamn uppdaterat!");
            }}
          />

          <EmailField
            initialValue={user?.email ?? ""}
          />

          <div className="mt-8">
            <ChangePasswordForm onSubmit={handlePasswordReset} />
          </div>
        </div>

        <div className="flex justify-center md:justify-end md:translate-x-40">
          <AvatarSection
            currentAvatarId={user?.avatarUrl ?? 1}
            avatars={safeAvatarList}
            onChange={async (newId) => {
              if (updateAvatar) {
                await updateAvatar(newId);
                toast.success("Profilbild uppdaterad!", { icon: '📸' });
              }
            }}
          />
        </div>
      </div>

      <h2 className="text-2xl font-bold mt-16 mb-6 uppercase italic">Kommande bokningar</h2>

      {loading ? (
        <p className="text-accent/60 mb-6 italic">Laddar dina bokningar...</p>
      ) : bookings.length === 0 ? (
        <p className="text-accent/60 mb-6 italic">Du har inga kommande bokningar</p>
      ) : (
        <div className="flex flex-col gap-4 mb-10">
          {bookings.map((booking) => (
            <UpcomingBookingCard
              key={booking.bookingId || booking.id}
              id={booking.bookingId || booking.id}
              movieId={booking.movieId}
              title={booking.movieTitle}
              dateLabel={booking.startTime ? formatScreeningDate(booking.startTime) : "Okänt datum"}
              timeLabel={new Date(booking.startTime).toLocaleTimeString("sv-SE", { hour: "2-digit", minute: "2-digit" })}
              theaterLabel={booking.theaterName + " salongen"}
              ticketsLabel={`${booking.ticketCount || 0} biljetter`}
              seatsLabel={formatSeatString(booking.seats, booking.theaterName)}
              onCancel={handleCancelBooking}
              cancelDisabled={false}
            />
          ))}
        </div>
      )}

      <div className="my-10 h-px bg-white/10" />

      {loading ? (
        <p className="text-accent/60 italic">Laddar historik...</p>
      ) : pastBookings.length === 0 ? (
        <p className="text-accent/60 mb-6 italic">Du har inga tidigare bokningar</p>
      ) : (
        <div className="mb-10">
          <h2 className="text-2xl font-bold mt-0 mb-4 uppercase italic">Tidigare bokningar</h2>
          <PastBookingCard
            onRateMovie={handleRateMovie} // <-- Länka in funktionen här!
            bookings={pastBookings.map((booking) => ({
              id: booking.bookingId || booking.id,
              movieId: booking.movieId, // <-- Skicka med movieId!
              title: booking.movieTitle,
              userRating: booking.userRating, // <-- Om ni hämtar betyg från DB, skicka med det här
              dateLabel: booking.startTime
                ? formatScreeningDate(booking.startTime)
                : "Okänt datum",
              timeLabel: new Date(booking.startTime).toLocaleTimeString("sv-SE", {
                hour: "2-digit",
                minute: "2-digit",
              }),
              theaterLabel: booking.theaterName + " salongen",
              ticketsLabel: `${booking.ticketCount || 0} biljetter`,
              seatsLabel: formatSeatString(booking.seats, booking.theaterName),
              seenLabel: `Sågs ${new Date(booking.startTime).toLocaleDateString("sv-SE", {
                day: "numeric",
                month: "long",
                year: "numeric",
              })}`,
            }))}
          />
        </div>
      )}

      <div className="mt-12">
        <AccountActions onLogout={() => {
          logout?.();
          toast("Utloggad. Välkommen åter!", { icon: '👋' });
        }} />
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