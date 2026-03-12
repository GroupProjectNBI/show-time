import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useOverlay } from "../context/OverlayContext";
import fetchJson from "../utils/fetchJson";

export default function FAQPage() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  // --- NYTT: State för formuläret ---
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  const { openAiChat } = useOverlay();
  const location = useLocation();

  useEffect(() => {
    if (!location.hash) return;
    const el = document.querySelector(location.hash);
    if (!el) return;
    setTimeout(() => {
      el.scrollIntoView({ behavior: "smooth" });
    }, 100);
  }, [location.hash]);

  // --- NYTT: Hantera skicka-knappen ---
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");

    try {
      await fetchJson("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      setStatus("success");
      setFormData({ name: "", email: "", message: "" }); // Rensa efteråt
    } catch (err) {
      console.error("Kunde inte skicka meddelande:", err);
      setStatus("error");
    }
  };

  const toggle = (i: number) => {
    setOpenIndex(openIndex === i ? null : i);
  };

  const faqs = [
    { q: "Hur många salonger har ni?", a: "Vi har två salonger som visar olika filmer och föreställningar." },
    { q: "Vilka filmer visar ni?", a: "Vi visar aktuella biofilmer, samt utvalda visingar beroende på säsong och efterfrågan." },
    { q: "Hur köper jag biljetter?", a: "Biljetter bokas enklast via vår hemsida, betalning sker dock på plats." },
    { q: "Får jag ta med egen mat, snacks och dryck?", a: "Det är inte tillåtet att ta med egen mat eller dryck. Vi erbjuder snacks, popcorn och dryck i vår kiosk." },
    { q: "Är biografen barnvänlig?", a: "Ja, vi visar filmer för alla åldrar och följer gällande åldersgränser." },
    { q: "Är biografen tillgänglighetsanpassad?", a: "Ja, kontakta oss gärna i förväg om du har särskilda behov." }
  ];

  const categories = [
    "Biobiljetter", "Tillgänglighet", "Villkor och policies", "På biografen",
    "Medlemskap", "Övriga frågor", "Program och filmfrågor", "Om Show-Time"
  ];

  return (
    <div className="w-full max-w-6xl mx-auto px-6 py-16 pb-2 text-accent">

      {/* INTRO SECTION */}
      <div className="text-center mb-16">
        <h1 className="text-4xl md:text-5xl font-bold mb-4 uppercase tracking-tighter">
          Frågor & Svar
        </h1>
        <p className="text-lg md:text-xl text-accent/80 max-w-2xl mx-auto">
          Välkommen till oss på KundService. Vad behöver du hjälp med?
        </p>
        <button
          onClick={openAiChat}
          className="mt-6 px-6 py-3 rounded-xl bg-accent text-primary font-bold hover:bg-accent/90 transition active:scale-95"
        >
          Chatta med oss
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-20">
        <div className="space-y-4">
          {faqs.map((item, i) => {
            const isOpen = openIndex === i;
            return (
              <div
                key={i}
                className="bg-white/5 border border-white/10 rounded-xl p-4 cursor-pointer transition hover:bg-white/10"
                onClick={() => toggle(i)}
              >
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold">{item.q}</h3>
                  <span className="text-2xl font-bold">{isOpen ? "−" : "+"}</span>
                </div>
                {isOpen && <p className="mt-3 text-accent/80 leading-relaxed">{item.a}</p>}
              </div>
            );
          })}
        </div>
        <div>
          <div className="w-full h-[475px] rounded-3xl overflow-hidden shadow-2xl grayscale hover:grayscale-0 transition-all duration-700">
            <img src="/images/Commercials/FAQimage.png" alt="FAQ Hero" className="w-full h-full object-cover" />
          </div>
        </div>
      </div>

      {/* CATEGORY BUTTONS */}
      <div className="mb-16">
        <h2 className="text-2xl font-semibold mb-6">Fler frågor och svar</h2>
        <div className="flex flex-wrap gap-4">
          {categories.map((cat, i) => (
            <button key={i} className="px-5 py-2 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition">
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* --- CONTACT FORM (Uppdaterad med logik) --- */}
      <div id="kontakt" className="bg-white/5 border border-white/10 rounded-3xl p-8 shadow-xl relative overflow-hidden">
        <h2 className="text-2xl font-semibold mb-6">Kontakta oss</h2>

        {status === "success" ? (
          <div className="py-12 text-center space-y-4">
            <div className="text-4xl text-green-500">✔</div>
            <h3 className="text-xl font-bold">Meddelande skickat!</h3>
            <p className="text-accent/60">Tack för att du hörde av dig. Vi återkommer så snart vi kan.</p>
            <button
              onClick={() => setStatus("idle")}
              className="text-sm underline opacity-50 hover:opacity-100"
            >
              Skicka ett till meddelande
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-accent/60 text-xs uppercase font-bold tracking-widest mb-2 ml-1">Namn</label>
                <input
                  required
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-accent focus:outline-none focus:border-accent/50 transition-colors"
                  placeholder="Ditt fullständiga namn"
                />
              </div>
              <div>
                <label className="block text-accent/60 text-xs uppercase font-bold tracking-widest mb-2 ml-1">Email</label>
                <input
                  required
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-accent focus:outline-none focus:border-accent/50 transition-colors"
                  placeholder="din.mail@exempel.se"
                />
              </div>
            </div>

            <div>
              <label className="block text-accent/60 text-xs uppercase font-bold tracking-widest mb-2 ml-1">Meddelande</label>
              <textarea
                required
                rows={4}
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-accent focus:outline-none focus:border-accent/50 transition-colors resize-none"
                placeholder="Vad kan vi hjälpa dig med?"
              ></textarea>
            </div>

            {status === "error" && (
              <p className="text-red-400 text-sm italic">Något gick fel, prova igen om en liten stund.</p>
            )}

            <button
              type="submit"
              disabled={status === "loading"}
              className={`
                px-10 py-4 rounded-xl font-bold uppercase tracking-widest transition-all
                ${status === "loading"
                  ? "bg-white/10 text-white/30 cursor-wait"
                  : "bg-accent text-primary hover:bg-accent/90 hover:scale-[1.02] active:scale-95 shadow-lg"}
              `}
            >
              {status === "loading" ? "Skickar..." : "Skicka meddelande"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}