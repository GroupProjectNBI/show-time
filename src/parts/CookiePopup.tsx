import React from "react";

type CookiePopupProps = {
  onAccept: () => void;
  onDecline?: () => void;
};

export default function CookiePopup({ onAccept, onDecline }: CookiePopupProps) {
  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center backdrop-blur-xs bg-black/60 p-4 animate-fadeIn">
      <div className="relative w-[90%] max-w-md bg-primary/90 rounded-3xl p-8 shadow-2xl border border-white/10">

        <h2 className="text-accent text-xl font-bold mb-4 text-center uppercase tracking-widest">
          Cookies
        </h2>

        <p className="text-accent/80 text-sm leading-relaxed text-center mb-6">
          Vi använder cookies för att förbättra din upplevelse på sidan,
          analysera trafik och anpassa innehåll. Du kan välja att acceptera
          eller neka användningen av cookies.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 mt-6">
          <button
            onClick={onAccept}
            className="flex-1 py-3 rounded-xl bg-red-600 text-white font-bold uppercase text-xs tracking-[0.3em] hover:bg-red-700 hover:scale-[1.02] active:scale-95 transition-all shadow-xl shadow-red-900/20"
          >
            Acceptera
          </button>

          <button
            onClick={onDecline}
            className="flex-1 py-3 rounded-xl bg-white/10 text-accent font-bold uppercase text-xs tracking-[0.3em] hover:bg-white/20 hover:scale-[1.02] active:scale-95 transition-all border border-white/10"
          >
            Neka
          </button>
        </div>
      </div>
    </div>
  );
}
