import { Link } from "react-router-dom";

export default function NotFoundPage() {
  return (
    <div className="min-h-screen bg-[#050505] flex flex-col items-center justify-center text-accent px-6 overflow-hidden relative">

      {/* 1. TOP-RIGHT SPOT (Ljuset från maskinrummet) */}
      <div className="absolute -top-20 -right-20 w-[300px] h-[300px] bg-primary/10 rounded-full blur-[80px] pointer-events-none"></div>

      {/* 2. CENTRAL GLÖD (Bakom texten) */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-white/5 rounded-full blur-[100px] pointer-events-none"></div>

      <div className="relative z-10 flex flex-col items-center">
        {/* 3. TYDLIG 404 */}
        <h1 className="text-8xl md:text-9xl font-extrabold tracking-tighter text-white/95">
          404
        </h1>

        {/* Subtil guldlinje */}
        <div className="w-16 h-1 bg-primary my-8 rounded-full shadow-[0_0_15px_rgba(var(--primary-rgb),0.3)]"></div>

        <div className="max-w-xs text-center space-y-6">
          <h2 className="text-xl md:text-2xl font-medium text-white tracking-tight">
            Tog du fel dörr?
          </h2>

          <p className="text-zinc-500 text-sm md:text-base leading-relaxed">
            Här visas ingen film för tillfället. Salongen är tom och ridån är dragen.
          </p>

          <div className="pt-8">
            <Link
              to="/"
              className="inline-flex items-center px-10 py-3 rounded-sm border border-primary text-primary font-bold tracking-[0.15em] text-xs hover:bg-primary hover:text-zinc-950 transition-all duration-500"
            >
              TILLBAKA TILL FOAJÉN
            </Link>
          </div>
        </div>
      </div>

      {/* 4. SUBTIL TEXT (Längst ner) */}
      <div className="absolute bottom-8 text-zinc-800 text-[10px] uppercase tracking-[0.3em] font-bold">
        Showtime Cinema • Lost in Translation
      </div>
    </div>
  );
}

NotFoundPage.route = {
  path: '*'
};