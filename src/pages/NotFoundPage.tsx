import { Link } from "react-router-dom";

export default function NotFoundPage() {
  return (
    <div className="min-h-screen bg-[#050505] flex flex-col items-center justify-center text-accent px-6 overflow-hidden relative font-sans pb-2">

      {/* 1. ATMOSFÄR: Mjuk glöd (Guld/Primary) */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/5 rounded-full blur-[130px] pointer-events-none z-0"></div>

      <div className="relative z-10 flex flex-col items-center max-w-sm">

        {/* 2. GRAFIK: En ensam, tom biostol */}
        <div className="relative mb-12 flex flex-col items-center group">
          {/* Spotlighten ovanifrån (Cream/Accent) */}
          <div className="absolute -top-16 w-1 h-20 bg-accent/20 rounded-full blur-sm group-hover:bg-primary/30 transition-colors duration-1000"></div>

          {/* Minimalistisk Biostol (Ikon eller enkel CSS) */}
          <div className="text-8xl opacity-90 group-hover:scale-110 transition-transform duration-500 ease-out cursor-default">
            💺
          </div>

          {/* En subtil guldlinje under (Primary) */}
          <div className="w-16 h-1 bg-primary mt-6 rounded-full shadow-[0_0_15px_rgba(var(--primary-rgb),0.3)]"></div>
        </div>

        {/* 3. MÄNSKLIG TEXT */}
        <div className="text-center space-y-5">
          <h1 className="text-3xl md:text-4xl font-bold text-white tracking-tight leading-tight">
            Plot twist: <span className="text-primary">Salongen är tom.</span>
          </h1>

          <p className="text-zinc-500 text-sm md:text-base leading-relaxed">
            Hoppsan! Du verkar ha tagit fel dörr. Sidan du letar efter finns tyvärr inte i vårt manus just nu.
          </p>
        </div>

        {/* 4. CLEAR CALL-TO-ACTION */}
        <div className="pt-12 w-full">
          <Link
            to="/"
            className="w-full inline-flex items-center justify-center px-10 py-4 rounded-sm bg-primary text-zinc-950 font-bold tracking-[0.1em] text-xs hover:bg-white transition-all duration-300 active:scale-95"
          >
            TILLBAKA TILL FOAJÉN
          </Link>
        </div>
      </div>

      {/* 5. DISKRET FOTNOT (Den tekniska delen) */}
      <div className="absolute bottom-8 flex items-center gap-3 text-zinc-800 text-[10px] uppercase tracking-[0.3em] font-medium">
        <span>Showtime Cinema</span>
        <span className="w-1 h-1 bg-zinc-800 rounded-full"></span>
        <span>Felkod 404</span>
      </div>
    </div>
  );
}

NotFoundPage.route = {
  path: '*'
};