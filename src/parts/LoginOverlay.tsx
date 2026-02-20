import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";

type LoginOverlayProps = {
  onClose: () => void;
  openMembership: () => void;
};

export default function LoginOverlay({ onClose, openMembership }: LoginOverlayProps) {

  // Skapa state för formuläret 
  const [formData, setFormData] = useState({ email: "", password: "" })
  const [error, setError] = useState("");


  // Hämta login funktionen från Contexten
  const { login } = useAuth();


  // Hantera ändringar i input fälten
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    // add new data to formData and use old data and spread new data to the array . 
    setFormData(prev => ({ ...prev, [name]: value }));
  }


  // hantera inloggnings klippet
  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("")
    const success = await login(formData);
    // vi kan använda oss av if else utan {} om vi har en linjes hantering
    if (success) onClose()
    else setError("Något gick fel.  Kolla email och lösenord")
  }


  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center backdrop-blur-xl bg-black/60 p-4">
      <div className="relative w-[90%] max-w-md bg-primary/90 rounded-3xl p-8 shadow-2xl border border-white/10">

        <button onClick={onClose} className="absolute top-6 right-6 text-accent text-4xl font-light hover:text-accent/80 transition">
          ×
        </button>

        {/* Formulär-rubrik */}
        <h2 className="text-accent text-2xl font-bold mb-6 text-center">Logga in</h2>

        <div className="space-y-5">
          {error && <p className="text-red-500 text-sm text-center">{error}</p>}

          <div>
            <label className="block text-accent mb-1 font-semibold">E-post</label>
            <input
              name="email" // Måste matcha nyckeln i formData
              value={formData.email}
              onChange={handleChange}
              type="email"
              className="w-full rounded-xl bg-white/10 border border-white/20 px-4 py-2 text-accent focus:outline-none"
              placeholder="din@mail.com"
            />
          </div>

          <div>
            <label className="block text-accent mb-1 font-semibold">Lösenord</label>
            <input
              name="password"
              value={formData.password}
              onChange={handleChange}
              type="password"
              className="w-full rounded-xl bg-white/20 border border-white/20 px-4 py-2 text-accent focus:outline-none"
              placeholder="******"
            />
          </div>
        </div>

        <div className="flex items-center gap-4 mt-8">
          <button
            onClick={handleLoginSubmit}
            className="flex-1 py-3 rounded-xl bg-red-600 text-white font-semibold hover:bg-red-700 transition"
          >
            Logga in
          </button>

          {/* BLI MEDLEM - Denna triggar din openMembership prop */}
          <button
            onClick={() => {
              onClose(); // Stäng inloggningen först
              openMembership(); // Öppna medlems-vyn
            }}
            className="flex-1 py-3 rounded-xl border border-accent/80 text-accent font-semibold hover:bg-accent hover:text-primary transition"
          >
            Bli medlem
          </button>
        </div>
      </div>
    </div>
  );
}