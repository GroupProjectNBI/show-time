//Ska denna kopplas till databas
import { useState } from "react";

type Props = {
  onSubmit: (newPassword: string) => void;
};

export default function ChangePasswordForm({ onSubmit }: Props) {
  const [password, setPassword] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(password);
    setPassword("");
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <input
        type="password"
        placeholder="Nytt lösenord"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="w-full rounded-xl bg-white/10 border border-white/20 px-4 py-2 text-accent placeholder-accent/40 focus:outline-none"
      />

      <button
        type="submit"
        className="rounded-xl bg-accent text-primary font-semibold px-6 py-2 hover:bg-accent/80 transition"
      >
        Uppdatera lösenord
      </button>
    </form>
  );
}
