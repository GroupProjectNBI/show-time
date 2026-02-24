import { useAuth } from "../context/AuthContext";
import ChangePasswordForm from "../parts/ChangePasswordForm";
import UpcomingBookingCard from "../parts/UpcomingBookingCard";

import AvatarSection from "../parts/AvatarSection";
import UsernameField from "../parts/UsernameField";
import EmailField from "../parts/EmailField";
import PasswordDisplay from "../parts/PasswordDisplay";
import AccountActions from "../parts/AccountActions";

export default function MyPage() {
  const { user, changePassword, logout } = useAuth();

  const bookings: any[] = [];

  const avatarList = [
    { id: 1, url: "/avatars/1.png" },
    { id: 2, url: "/avatars/2.png" },
    { id: 3, url: "/avatars/3.png" },
    { id: 4, url: "/avatars/4.png" },
  ];

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

      {/* ---------------- BOOKINGS ---------------- */}
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
      />

      <AccountActions onLogout={logout} />
    </div>
  );
}

MyPage.route = {
  path: "/mypage",
  index: 99,
  menuLabel: null
};
