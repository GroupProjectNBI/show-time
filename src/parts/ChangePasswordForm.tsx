import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";
import {
  KeyRound,
  Mail,
  Loader2,
  CheckCircle2,
  Eye,
  EyeOff,
  ArrowLeft
} from "lucide-react";

type Props = {
  // Vi förväntar oss att onSubmit returnerar ett Promise från föräldern
  onSubmit: (code: string, newPassword: string) => Promise<void>;
};

export default function ChangePasswordForm({ onSubmit }: Props) {
  const { user } = useAuth();

  // States
  const [step, setStep] = useState<1 | 2>(1);
  const [code, setCode] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // STEG 1: Begär kod från backend
  const handleSendCode = async () => {
    if (!user?.email) return;

    setLoading(true);
    try {
      const response = await fetch("/api/request-password-reset", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: user.email }),
      });

      const result = await response.json();

      if (result.success) {
        toast.success("En verifieringskod har skickats!");
        setStep(2);
      } else {
        toast.error(result.error || "Kunde inte skicka kod.");
      }
    } catch (error) {
      toast.error("Nätverksfel. Kontrollera din anslutning.");
    } finally {
      setLoading(false);
    }
  };

  // STEG 2: Skicka kod + nytt lösenord till föräldern (MyPage)
  const handleFinalSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (code.length !== 6) {
      toast.error("Koden måste vara 6 siffror.");
      return;
    }

    if (password.length < 4) {
      toast.error("Lösenordet måste vara minst 4 tecken.");
      return;
    }

    setLoading(true);
    try {
      // Vi kör onSubmit som vi fått via props från MyPage
      await onSubmit(code, password);

      // Om MyPage inte kastar ett fel, visar vi succé!
      toast.success("Lösenordet är nu uppdaterat! 🎉", {
        duration: 4000,
        icon: '🔒',
        style: {
          borderRadius: '12px',
          background: '#1a1a1a',
          color: '#ffcc00',
          border: '1px solid #ffcc00'
        },
      });

      // Vänta lite, nollställ sedan formuläret
      setTimeout(() => {
        setStep(1);
        setCode("");
        setPassword("");
        setShowPassword(false);
      }, 3000);

    } catch (error: any) {
      // Om MyPage kastar ett error (t.ex. fel kod), visa det här
      toast.error(error.message || "Kunde inte uppdatera lösenordet.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white/5 p-6 rounded-2xl border border-white/10 shadow-xl relative">
      <h2 className="text-xl font-semibold mb-4 flex items-center gap-2 text-white">
        <KeyRound className="w-5 h-5 text-accent" />
        Säkerhet
      </h2>

      {step === 1 && (
        <div className="animate-in fade-in duration-500">
          <p className="text-white/70 text-sm mb-6 leading-relaxed">
            För att byta lösenord behöver vi verifiera din identitet.
            Vi skickar en engångskod till din e-post.
          </p>
          <button
            type="button"
            disabled={loading}
            onClick={handleSendCode}
            className="flex items-center gap-2 rounded-xl bg-accent text-primary font-bold px-6 py-3 hover:bg-accent/80 transition active:scale-95 disabled:opacity-50"
          >
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Mail className="w-5 h-5" />}
            Skicka verifieringskod
          </button>
        </div>
      )}

      {step === 2 && (
        <form onSubmit={handleFinalSubmit} className="space-y-5 animate-in slide-in-from-bottom-2 duration-500">
          <div className="p-3 bg-accent/10 border border-accent/20 rounded-xl">
            <p className="text-accent text-xs">
              Koden skickades till <b>{user?.email}</b>
            </p>
          </div>

          {/* Kod-fält */}
          <div className="space-y-1">
            <label className="text-[10px] text-white/50 ml-1 uppercase font-bold tracking-widest">
              Engångskod (6 siffror)
            </label>
            <input
              type="text"
              inputMode="numeric"
              pattern="[0-9]*"
              maxLength={6}
              required
              placeholder="000000"
              value={code}
              onChange={(e) => setCode(e.target.value.replace(/\D/g, ""))}
              className="w-full rounded-xl bg-white/5 border border-white/10 px-4 py-3 text-accent text-lg tracking-[0.5em] focus:border-accent focus:outline-none transition placeholder:tracking-normal placeholder:text-white/10"
            />
          </div>

          {/* Lösenords-fält */}
          <div className="space-y-1">
            <label className="text-[10px] text-white/50 ml-1 uppercase font-bold tracking-widest">
              Nytt lösenord
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                required
                placeholder="Minst 4 tecken"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-xl bg-white/5 border border-white/10 px-4 py-3 text-white focus:border-accent focus:outline-none transition pr-12"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-white/30 hover:text-accent transition"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>

          <div className="pt-2 space-y-3">
            <button
              type="submit"
              disabled={loading}
              className="w-full flex justify-center items-center gap-2 rounded-xl bg-accent text-primary font-bold px-6 py-3 hover:bg-accent/80 transition active:scale-[0.98] disabled:opacity-50"
            >
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <CheckCircle2 className="w-5 h-5" />}
              Spara nytt lösenord
            </button>

            <button
              type="button"
              onClick={() => setStep(1)}
              className="w-full flex items-center justify-center gap-1 text-xs text-white/30 hover:text-white/60 transition"
            >
              <ArrowLeft className="w-3 h-3" />
              Gå tillbaka
            </button>
          </div>
        </form>
      )}
    </div>
  );
}