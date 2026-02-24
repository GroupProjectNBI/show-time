import { useAuth } from "../context/AuthContext";
import ChangePasswordForm from "../parts/ChangePasswordForm";
import UpcomingBookingCard from "../parts/UpcomingBookingCard";

import AvatarSection from "../parts/AvatarSection";
import PasswordDisplay from "../parts/PasswordDisplay";
import AccountActions from "../parts/AccountActions";
import UsernameField from "../parts/UsernameField";
import EmailField from "./EmailField";

export default function MyPage() {
  const { user, changePassword, logout } = useAuth();

  // Mock tills BookingContext är klar
  const bookings: any[] = [];

  // Mock avatarlista tills backend är klar
  const avatarList = [
    { id: 1, url: "/avatars/1.png" },
    { id: 2, url: "/avatars/2.png" },
    { id: 3, url: "/avatars/3.png" },
    { id: 4, url: "/avatars/4.png" },
  ];

  return (
    <div className="max-w-3xl mx-auto mt-32 px-4 pb-20 text-accent">

      {/* PAGE TITLE */}
      <h1 className="text-4xl font-bold mb-10 text-center">Min sida</h1>

      {/* ---------------- PROFILE SECTION ---------------- */}
      <AvatarSection
        currentAvatarId={user?.avatarUrl ?? 1}
        avatars={avatarList}
        onChange={(newId) => {
          console.log("Byt avatar till:", newId);
          // TODO: API-anrop + update user
        }}
      />

      <UsernameField
        initialValue={user?.userName ?? ""}
        onSave={(newName) => {
          console.log("Spara nytt användarnamn:", newName);
          //TODO: API-anrop + update user
        }}
      />

      <EmailField
        initialValue={user?.email ?? ""}
        onSave={(newEmail) => {
          console.log("Spara ny email:", newEmail);
          //TODO: API-anrop + update user
        }}
      />

      <p className="text-accent/60 text-sm mb-12">
        Medlem sedan 2024
      </p>

      {/* ---------------- SECURITY SECTION ---------------- */}
      <h2 className="text-2xl font-semibold mb-4">Säkerhet</h2>

      <PasswordDisplay password="********" />

      <div className="mt-6">
        <ChangePasswordForm onSubmit={changePassword} />
      </div>

      {/* ---------------- BOOKINGS SECTION ---------------- */}
      <h2 className="text-2xl font-semibold mt-12 mb-4">Kommande bokningar</h2>

      {bookings.length === 0 && (
        <p className="text-accent/60 mb-6">Du har inga kommande bokningar</p>
      )}

      {/* Exempelbokning (mock) */}
      <UpcomingBookingCard
        title="Dune: Messiah"
        dateLabel="Lör 14 mars 2026"
        timeLabel="19:30"
        theaterLabel="Stora salongen"
        ticketsLabel="2 biljetter"
        seatsLabel="A5, A6"
      />

      {/* ---------------- ACCOUNT SECTION ---------------- */}
      <AccountActions onLogout={logout} />
    </div>
  );
}

MyPage.route = {
  path: "/mypage",
  index: 99,
  menuLabel: null
};
