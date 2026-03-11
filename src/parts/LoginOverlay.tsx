import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";
import { Mail, Lock, ArrowLeft, Loader2, HelpCircle } from "lucide-react";

type LoginOverlayProps = {
  onClose: () => void;
  openMembership: () => void;
};

type ViewMode = "login" | "request" | "reset";

export default function LoginOverlay({ onClose, openMembership }: LoginOverlayProps) {
  const { login } = useAuth();

  const [view, setView] = useState<ViewMode>("login");
  const [formData, setFormData] = useState({ email: "", password: "", code: "" });
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const success = await login({ email: formData.email, password: formData.password });
    if (success) {
      toast.success("Välkommen tillbaka!");
      onClose();
    } else {
      toast.error("Fel e-post eller lösenord.");
    }
    setLoading(false);
  };

  const handleRequestCode = async () => {
    if (!formData.email.includes("@")) return toast.error("Ange en giltig e-post.");
    setLoading(true);
    try {
      const res = await fetch("/api/request-password-reset", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: formData.email })
      });
      const result = await res.json();
      if (result.success) {
        toast.success("Verifieringskoden är på väg!");
        setView("reset");
      } else {
        toast.error(result.error || "Kunde inte skicka kod.");
      }
    } catch (err) {
      toast.error("Nätverksfel.");
    } finally {
      setLoading(false);
    }
  };

  const handleResetSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("/api/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: formData.email,
          code: formData.code,
          newPassword: formData.password
        })
      });
      const result = await res.json();
      if (result.success) {
        toast.success("Klart! Logga in med ditt nya lösenord.");
        setView("login");
      } else {
        toast.error(result.error || "Fel kod eller ogiltigt lösenord.");
      }
    } catch (err) {
      toast.error("Nätverksfel.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center backdrop-blur-xl bg-black/60 p-4">
      <div className="relative w-[90%] max-w-md bg-primary/95 rounded-3xl p-8 shadow-2xl border border-white/10">

        <button onClick={onClose} className="absolute top-6 right-6 text-white/30 hover:text-accent text-3xl transition-colors">
          ×
        </button>

        <h2 className="text-accent text-3xl font-black mb-8 text-center uppercase tracking-tighter italic">
          {view === "login" ? "Logga in" : view === "request" ? "Glömt lösen" : "Nytt lösen"}
        </h2>

        {/* --- VY: LOGGA IN --- */}
        {view === "login" && (
          <form onSubmit={handleLoginSubmit} className="space-y-6 animate-in fade-in zoom-in-95 duration-300">
            <div className="space-y-1">
              <label className="flex items-center gap-2 text-accent/70 text-xs uppercase font-bold tracking-widest ml-1">
                <Mail className="w-3 h-3" /> E-post
              </label>
              <input name="email" value={formData.email} onChange={handleChange} type="email" required className="w-full rounded-2xl bg-white/5 border border-white/10 px-5 py-4 text-white focus:border-accent outline-none transition-all" placeholder="din@mail.com" />
            </div>

            <div className="space-y-1">
              <label className="flex items-center gap-2 text-accent/70 text-xs uppercase font-bold tracking-widest ml-1">
                <Lock className="w-3 h-3" /> Lösenord
              </label>
              <input name="password" value={formData.password} onChange={handleChange} type="password" required className="w-full rounded-2xl bg-white/5 border border-white/10 px-5 py-4 text-white focus:border-accent outline-none transition-all" placeholder="******" />

              {/* HÄR ÄR DEN NYA POPPANDE LÄNKEN */}
              <div className="flex justify-end pt-2">
                <button
                  type="button"
                  onClick={() => setView("request")}
                  className="flex items-center gap-1.5 text-xs font-bold text-accent hover:text-white transition-colors group"
                >
                  <HelpCircle className="w-3.5 h-3.5 group-hover:animate-bounce" />
                  Glömt lösenordet? <span className="underline underline-offset-4 decoration-accent/40 hover:decoration-white">Klicka här</span>
                </button>
              </div>
            </div>

            <div className="flex flex-col gap-3 pt-4">
              <button disabled={loading} type="submit" className="w-full py-4 rounded-2xl bg-red-600 text-white font-black uppercase tracking-widest hover:bg-red-700 transition-all shadow-lg shadow-red-600/20 active:scale-[0.98] flex justify-center">
                {loading ? <Loader2 className="animate-spin w-6 h-6" /> : "Logga in"}
              </button>
              <button type="button" onClick={() => { onClose(); openMembership(); }} className="w-full py-4 rounded-2xl border border-white/10 text-white/70 font-bold hover:bg-white/5 transition-all text-sm">
                Inte medlem? <span className="text-accent">Bli medlem gratis</span>
              </button>
            </div>
          </form>
        )}

        {/* --- VY: BE OM KOD --- */}
        {view === "request" && (
          <div className="space-y-6 animate-in slide-in-from-right-8 duration-400">
            <div className="text-center space-y-2">
              <p className="text-white font-semibold">Ingen fara, det händer oss alla! 🍿</p>
              <p className="text-white/50 text-xs">Skriv in din e-post så skickar vi en 6-siffrig kod direkt.</p>
            </div>
            <input name="email" value={formData.email} onChange={handleChange} type="email" className="w-full rounded-2xl bg-white/5 border border-white/10 px-5 py-4 text-white outline-none focus:border-accent" placeholder="din@mail.com" />
            <button onClick={handleRequestCode} disabled={loading} className="w-full py-4 rounded-2xl bg-accent text-primary font-black uppercase tracking-widest hover:bg-accent/80 transition-all flex justify-center shadow-lg shadow-accent/20">
              {loading ? <Loader2 className="animate-spin w-6 h-6" /> : "Skicka kod"}
            </button>
            <button onClick={() => setView("login")} className="w-full flex items-center justify-center gap-2 text-sm text-white/40 hover:text-white transition-colors">
              <ArrowLeft className="w-4 h-4" /> Tillbaka till start
            </button>
          </div>
        )}

        {/* --- VY: ÅTERSTÄLL LÖSENORD --- */}
        {view === "reset" && (
          <form onSubmit={handleResetSubmit} className="space-y-6 animate-in slide-in-from-right-8 duration-400">
            <div className="p-4 bg-accent/10 border border-accent/20 rounded-2xl text-center">
              <p className="text-accent text-sm font-bold">Kolla din inbox! 📧</p>
              <p className="text-accent/60 text-[10px] uppercase mt-1">Vi har skickat koden till din mail.</p>
            </div>
            <div className="space-y-1">
              <label className="text-[10px] text-white/40 uppercase font-black tracking-widest ml-1">6-siffrig kod</label>
              <input name="code" value={formData.code} onChange={handleChange} maxLength={6} type="text" placeholder="000000" className="w-full rounded-2xl bg-white/5 border border-white/10 px-5 py-4 text-accent text-center text-2xl tracking-[0.5em] outline-none focus:border-accent" />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] text-white/40 uppercase font-black tracking-widest ml-1">Nytt lösenord</label>
              <input name="password" value={formData.password} onChange={handleChange} type="password" placeholder="Minst 4 tecken" className="w-full rounded-2xl bg-white/5 border border-white/10 px-5 py-4 text-white outline-none focus:border-accent" />
            </div>
            <button disabled={loading} type="submit" className="w-full py-4 rounded-2xl bg-accent text-primary font-black uppercase tracking-widest hover:bg-accent/80 transition-all flex justify-center">
              {loading ? <Loader2 className="animate-spin w-6 h-6" /> : "Spara & Logga in"}
            </button>
          </form>
        )}

      </div>
    </div>
  );
}