import { useState } from "react";

function ChangePasswordForm({ onSubmit }; { onSubmit: (pw: string) => void }) {
  const [password, setPassword] = useState("");

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit(password);
        setPassword("");
      }}
      className="space-y-4"
    >
      <input
        type="password"
        placeholder="Nytt lösenord"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="w-full rounded-xl bg-white/10 border border-white/20 px-4 py-2 text-accent/40 focus:outline-none"
      />

      <button
        type="sumbit"
        className="rounded-xl bg-accent text-primary font-semibold px-6 py-2 hover:bg-accent/80 transition"
      >
        Uppdatera lösenord
      </button>
    </form>
  );
}