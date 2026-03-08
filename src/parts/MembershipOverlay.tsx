import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import fetchJson from "../utils/fetchJson";

type MembershipOverlayProps = {
  onClose: () => void;
};

interface Avatar {
  id: number;
  url: string;
}

export default function MembershipOverlay({ onClose }: MembershipOverlayProps) {
  const { create } = useAuth();
  const [avatars, setAvatars] = useState<Avatar[]>([]);
  const [avatarIndex, setAvatarIndex] = useState(0);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    userName: "",
    role: "user",
    email: "",
    password: "",
    confirmPassword: "",
    avatarUrl: 3
  });

  const [error, setError] = useState("");

  // Hämta avatarer
  useEffect(() => {
    async function getAvatars() {
      try {
        const data = await fetchJson("/api/Avatar?limit=20");

        if (Array.isArray(data) && data.length > 0) {
          setAvatars(data);

          const middleIndex = Math.floor(data.length / 2);
          setAvatarIndex(middleIndex);

          setFormData(prev => ({
            ...prev,
            avatarUrl: data[middleIndex].id
          }));
        }
      } catch (err) {
        console.error("Kunde inte hämta avatarer", err);
      }
    }
    getAvatars();
  }, []);

  // Carousel-funktioner
  const nextAvatar = () => {
    if (avatars.length === 0) return;
    const newIndex = (avatarIndex + 1) % avatars.length;
    setAvatarIndex(newIndex);
    setFormData(prev => ({ ...prev, avatarUrl: avatars[newIndex].id }));
  };

  const prevAvatar = () => {
    if (avatars.length === 0) return;
    const newIndex = (avatarIndex - 1 + avatars.length) % avatars.length;
    setAvatarIndex(newIndex);
    setFormData(prev => ({ ...prev, avatarUrl: avatars[newIndex].id }));
  };

  // Form-inputs
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      setError("Lösenorden matchar inte");
      return;
    }

    setIsSubmitting(true);
    setError("");

    try {
      const { confirmPassword, ...dataToSubmit } = formData;
      const success = await create(dataToSubmit);

      if (success) onClose();
    } catch (err: any) {
      setError(err.message || "Kunde inte skapa konto.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center backdrop-blur-xl bg-black/60 p-4 animate-fadeIn">
      <form
        onSubmit={handleSubmit}
        className="relative w-[90%] max-w-md bg-primary/90 rounded-3xl p-8 shadow-2xl border border-white/10"
      >
        {/* Stäng-knapp */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-6 right-6 text-accent text-4xl font-light hover:text-accent/80 transition"
        >
          ×
        </button>

        <h2 className="text-accent text-xl font-bold mb-6 text-center uppercase tracking-widest">
          Bli medlem
        </h2>

        {/* ⭐ AVATAR CAROUSEL ⭐ */}
        {avatars.length > 0 && (
          <div className="flex flex-col items-center mb-8">

            <div className="flex items-center gap-6">

              {/* Vänster pil */}
              <button
                type="button"
                onClick={prevAvatar}
                className="text-accent text-4xl font-light hover:text-accent/70 transition"
              >
                ‹
              </button>

              {/* Avatar-bild */}
              <img
                src={avatars[avatarIndex]?.url}
                alt="Vald avatar"
                className="w-24 h-24 rounded-full border border-white/20 shadow-lg"
              />

              {/* Höger pil */}
              <button
                type="button"
                onClick={nextAvatar}
                className="text-accent text-4xl font-light hover:text-accent/70 transition"
              >
                ›
              </button>

            </div>

            <p className="text-accent/60 text-xs mt-2 tracking-wide">
              Avatar {avatarIndex + 1} av {avatars.length}
            </p>
          </div>
        )}

        {/* Error */}
        {error && (
          <p className="text-red-200 bg-red-500/20 border border-red-500/50 p-2 rounded-lg text-xs text-center mb-4 italic">
            {error}
          </p>
        )}

        {/* Inputs */}
        <div className="space-y-4">
          <div>
            <label className="block text-accent text-[10px] mb-1 font-semibold uppercase tracking-widest opacity-70">
              Användarnamn
            </label>
            <input
              name="userName"
              value={formData.userName}
              onChange={handleChange}
              type="text"
              required
              className="w-full rounded-xl bg-white/5 border border-white/10 px-4 py-2 text-accent focus:bg-white/10 focus:outline-none transition"
              placeholder="CoolUser42"
            />
          </div>

          <div>
            <label className="block text-accent text-[10px] mb-1 font-semibold uppercase tracking-widest opacity-70">
              E-post
            </label>
            <input
              name="email"
              value={formData.email}
              onChange={handleChange}
              type="email"
              required
              className="w-full rounded-xl bg-white/5 border border-white/10 px-4 py-2 text-accent focus:bg-white/10 focus:outline-none transition"
              placeholder="namn@exempel.se"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <input
              name="password"
              value={formData.password}
              onChange={handleChange}
              type="password"
              required
              className="w-full rounded-xl bg-white/5 border border-white/10 px-4 py-2 text-accent focus:outline-none"
              placeholder="Lösenord"
            />
            <input
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              type="password"
              required
              className="w-full rounded-xl bg-white/5 border border-white/10 px-4 py-2 text-accent focus:outline-none"
              placeholder="Bekräfta"
            />
          </div>
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full mt-8 py-4 rounded-xl bg-red-600 text-white font-bold uppercase text-xs tracking-[0.3em] hover:bg-red-700 hover:scale-[1.02] active:scale-95 transition-all shadow-xl shadow-red-900/20 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center min-h-[52px]"
        >
          {isSubmitting ? (
            <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
          ) : (
            "Bli medlem"
          )}
        </button>
      </form>
    </div>
  );
}
