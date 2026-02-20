import { useAuth } from "../context/AuthContext";
import { useBooking } from "../context/BookingContext";
import ChangePasswordForm from "../parts/ChangePasswordForm";

import { useState } from "react";

export default function MyPage() {
  const { user, changePassword } = useAuth();
  const { bookings, cancelBoking } = useBooking();

  return (
    <div className="max-w-3xl mx-auto mt-32 px-4 pb-20 text-accent">

      <h1 className="text-4xl font-bold mb-10 text-center">Min sida</h1>

      {/*USER INFO*/}
      <div className="mb-12">
        <div className="flex items-center gap-6">
          <img
            src={user?.avatar}
            alt="Avatar"
            className="w-24 h-24 rounded-full border border-white/20"
          />

          <div>
            <p className="text-xl font-semibold">{user?.email}</p>
            <p className="text-accent/60 text-sm mt-1">Medlem sedan 2024</p>
          </div>
        </div>

        {/*CHANGE PASSWORD*/}
        <div className="mt-8">
          <h2 className="text-2xl font-semibold mb-4">Byt lösenord</h2>
          <changePassword onSubmit={changePassword} />
        </div>
      </div>

      {/*BOOKINGS - NO DESIGN*/}
      <div>
        <h2 className="text-2xl font-semibold mb-4">Kommande bokningar</h2>

        {bookings.lenght === 0 && (
          <p className="text-accent/60">Du har inga kommande bokningar</p>
        )}

        <ul className="space-y-4">
          {bookings.map((b) => (
            <li key={b.id} className="flex justify-between items-center">

              {/*LEFT SIDE: TEXT ONLY*/}
              <div>
                <p className="font-semibold">{b.movieTitle}</p>
                <p className="text-accent/60 text-sm">
                  {b.date} - {b.time}
                </p>
                <p className="text-accent/60 text-sm">
                  Salong {b.room} - Plats {b.seat}
                </p>
              </div>

              {/*CANCEL BUTTON */}
              <button
                onClick={() => cancelBoking(b.id)}
                className="rounded-full border border-red-500 px-4 py-1.5 text-red-400 font-semibold hover:bg-red-600 hover:text-white transition"
              >
                Avboka
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}