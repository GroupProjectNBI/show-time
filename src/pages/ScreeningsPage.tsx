import { useState, useEffect, useMemo } from "react";
import fetchJson from "../utils/fetchJson";
import ScreeningsList from "../parts/ScreeningsList";
import DateDropdown from "../parts/DateDropdown";
import type { Screening } from "../interfaces/Screenings";
import { formatDate } from "../utils/formatTime";
import { Filter, ArrowUpDown, X } from "lucide-react";
import { Link } from "react-router-dom";

export default function ScreeningsPage() {
  // --- STATE ---
  const [allScreenings, setAllScreenings] = useState<Screening[]>([]);
  const [loading, setLoading] = useState(true);

  // Datumstate - Börjar på dagens datum
  const [selectedDateISO, setSelectedDateISO] = useState<string>(formatDate(new Date()));

  // Toggle för den extra filterpanelen
  const [showFilters, setShowFilters] = useState(false);

  // Filter & Sortering
  const [filters, setFilters] = useState({
    movie: "",
    category: "",
    theater: "",
    ageLimit: "" as "" | "11" | "15" | "18",
  });
  const [sortOrder, setSortOrder] = useState("dateAsc");

  // --- HÄMTA DATA (Körs en gång) ---
  useEffect(() => {
    async function loadData() {
      // Vi hämtar ALLA visningar från databasen, struntar i tidsfiltret i URL:en
      const url = `/api/v_screenings?orderby=startTime`;
      const data = await fetchJson(url);

      if (data && !data.error) {
        // Hämta vad klockan är just exakt nu
        const now = new Date();

        // Sila bort alla visningar som redan har startat!
        const upcomingScreenings = data.filter((screening: Screening) => {
          // new Date() här förstår databasens format perfekt
          const screeningTime = new Date(screening.startTime);
          return screeningTime > now;
        });

        // Spara BARA de framtida visningarna i vårt state
        setAllScreenings(upcomingScreenings);
      }

      setLoading(false);
    }
    loadData();
  }, []);

  // --- BERÄKNA UNIKA VAL FÖR DROPDOWNS ---
  const uniqueMovies = useMemo(() =>
    Array.from(new Set(allScreenings.map(s => s.movieTitle))).sort(),
    [allScreenings]);

  const uniqueTheaters = useMemo(() =>
    Array.from(new Set(allScreenings.map(s => s.theaterName))).sort(),
    [allScreenings]);

  const uniqueCategories = useMemo(() => {
    const cats = new Set<string>();
    allScreenings.forEach(s => {
      // Vi läser 'categories' som vi la till i din SQL-vy
      const catString = (s as any).categories || "";
      if (catString) {
        // Splitta på komma (eftersom SQL kör GROUP_CONCAT) och trimma mellanslag
        catString.split(",").forEach((c: string) => {
          const trimmed = c.trim();
          if (trimmed) cats.add(trimmed);
        });
      }
    });
    return Array.from(cats).sort();
  }, [allScreenings]);

  // --- FILTRERINGSLOGIK ---
  const processedScreenings = useMemo(() => {
    let result = [...allScreenings];

    // 1. Datumfilter (Endast om användaren har ett datum valt)
    if (selectedDateISO) {
      result = result.filter(s => s.startTime.startsWith(selectedDateISO));
    }

    // 2. Filmfilter
    if (filters.movie) {
      result = result.filter(s => s.movieTitle === filters.movie);
    }

    // 3. Genrefilter (Kategori)
    if (filters.category) {
      result = result.filter(s => {
        const catString = (s as any).categories || "";
        return catString.includes(filters.category);
      });
    }

    // 4. Salongsfilter
    if (filters.theater) {
      result = result.filter(s => s.theaterName === filters.theater);
    }

    // 5. Åldersfilter (max)
    if (filters.ageLimit) {
      const maxAge = Number(filters.ageLimit);
      result = result.filter(s => Number(s.ageLimit) <= maxAge);
    }

    // 6. Sortering
    result.sort((a, b) => {
      switch (sortOrder) {
        case "dateAsc": return new Date(a.startTime).getTime() - new Date(b.startTime).getTime();
        case "nameAsc": return a.movieTitle.localeCompare(b.movieTitle);
        case "lengthDesc": return (b.duration || 0) - (a.duration || 0);
        default: return 0;
      }
    });

    return result;
  }, [allScreenings, selectedDateISO, filters, sortOrder]);

  // --- SMART HANDLER ---
  const handleFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;

    // UX-LOGIK: Om man väljer en Genre eller en specifik Film, 
    // nollställer vi datumet så användaren ser alla tillgängliga tider framåt.
    if ((name === "category" || name === "movie") && value !== "") {
      setSelectedDateISO("");
    }

    setFilters({ ...filters, [name]: value });
  };

  const clearFilters = () => {
    setFilters({ movie: "", category: "", theater: "", ageLimit: "" });
    setSortOrder("dateAsc");
    setSelectedDateISO(formatDate(new Date())); // Återställ till Idag
  };

  // Tailwind-klass för alla selects
  const inputClass = "w-full bg-[#1a1a1a] text-white border border-white/10 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-[#c0a060] transition-colors appearance-none cursor-pointer";

  return (
    <div className="min-h-screen pt-8 pb-0">
      <div className="mx-auto w-[min(1200px,calc(100%-32px))]">

        {/* HEADER */}
        <div className="mb-8 border-b border-white/10 pb-6">
          <h1 className="text-2xl font-semibold text-accent uppercase tracking-widest"><Link to="#" className="shrink-0">Bioprogram</Link></h1>
          <p className="mt-1 text-accent/70 max-w-3xl font-light">
            Hitta rätt film för kvällen. Filtrera på genre, salong eller välj ett specifikt datum.
          </p>
        </div>

        {/* KONTROLLPANEL */}
        <div className="mb-6 flex flex-col gap-3 md:flex-row md:items-center md:gap-4">

          <div className="relative z-20">
            <DateDropdown
              valueISO={selectedDateISO}
              onChange={setSelectedDateISO}
            />
            {/* Hjälptext om datumet är nollställt */}
            {!selectedDateISO && (
              <button
                onClick={() => setSelectedDateISO(formatDate(new Date()))}
                className="absolute -bottom-5 left-0 text-[10px] text-[#c0a060] hover:underline"
              >
                Visa bara idag
              </button>
            )}
          </div>

          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`
              w-full md:w-auto rounded-xl px-10 py-2 text-sm font-semibold text-accent transition flex items-center justify-center gap-2
              ${showFilters ? 'bg-primary ring-2 ring-white/20' : 'bg-primary hover:opacity-90'}
            `}
          >
            <Filter size={16} />
            {showFilters ? "Göm filter" : "Fler filter"}
          </button>

          <span className="hidden md:block ml-auto text-sm text-accent/30 italic font-light">
            {processedScreenings.length} visningar hittades
          </span>
        </div>

        {/* FILTERPANEL (Expanderbar) */}
        {showFilters && (
          <div className="mb-8 bg-[#232323] border border-white/10 rounded-2xl p-6 shadow-2xl animate-in fade-in slide-in-from-top-2 duration-300">

            <div className="grid grid-cols-1 md:grid-cols-5 gap-6">

              {/* FILM */}
              <div>
                <label className="text-[10px] text-[#c0a060] uppercase tracking-[0.2em] mb-2 block font-bold">Välj film</label>
                <select name="movie" value={filters.movie} onChange={handleFilterChange} className={inputClass}>
                  <option value="">Alla filmer</option>
                  {uniqueMovies.map(m => <option key={m} value={m}>{m}</option>)}
                </select>
              </div>

              {/* GENRE */}
              <div>
                <label className="text-[10px] text-[#c0a060] uppercase tracking-[0.2em] mb-2 block font-bold">Genre</label>
                <select name="category" value={filters.category} onChange={handleFilterChange} className={inputClass}>
                  <option value="">Alla genrer</option>
                  {uniqueCategories.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>

              {/* SALONG */}
              <div>
                <label className="text-[10px] text-[#c0a060] uppercase tracking-[0.2em] mb-2 block font-bold">Salong</label>
                <select name="theater" value={filters.theater} onChange={handleFilterChange} className={inputClass}>
                  <option value="">Alla salonger</option>
                  {uniqueTheaters.map(t => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>

              <div>
                <label className="text-[10px] text-[#c0a060] uppercase tracking-[0.2em] mb-2 block font-bold">
                  Åldersgräns (max)
                </label>
                <select
                  name="ageLimit"
                  value={filters.ageLimit}
                  onChange={handleFilterChange}
                  className={inputClass}
                >
                  <option value="">Alla</option>
                  <option value="11">11+</option>
                  <option value="15">15+</option>
                  <option value="18">18+</option>
                </select>
              </div>

              {/* SORTERING */}
              <div>
                <label className="text-[10px] text-[#c0a060] uppercase tracking-[0.2em] mb-2 block font-bold">Sortera efter</label>
                <div className="relative">
                  <select value={sortOrder} onChange={(e) => setSortOrder(e.target.value)} className={inputClass}>
                    <option value="dateAsc">Tid (Tidigast)</option>
                    <option value="nameAsc">Titel (A-Ö)</option>
                    <option value="lengthDesc">Längd (Längst)</option>
                  </select>
                  <ArrowUpDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-white/20 pointer-events-none" />
                </div>
              </div>
            </div>

            {/* RENSA-KNAPP */}
            {(filters.movie || filters.category || filters.theater || !selectedDateISO) && (
              <div className="mt-6 pt-4 border-t border-white/5 flex justify-end">
                <button onClick={clearFilters} className="text-red-400/60 hover:text-red-400 text-xs flex items-center gap-1 transition-colors uppercase tracking-widest font-bold">
                  <X size={14} /> Återställ alla filter
                </button>
              </div>
            )}
          </div>
        )}

        {/* LIST-HEADER (Desktop) */}
        <div className="hidden md:grid md:grid-cols-[140px_1fr_280px] md:border-b md:border-white/5 md:pb-4 md:text-[10px] md:uppercase md:tracking-[0.2em] md:font-bold md:text-accent/30">
          <div>Datum & Tid</div>
          <div>Filminformation</div>
          <div>Platser & Bokning</div>
        </div>

        {/* SJÄLVA LISTAN */}
        <div className="divide-y divide-white/5">
          {loading ? (
            <p className="py-20 text-center text-[#c0a060] animate-pulse tracking-widest uppercase text-sm">Hämtar visningar...</p>
          ) : (
            <ScreeningsList screenings={processedScreenings} />
          )}
        </div>

        <div className="h-20" />
      </div>
    </div>
  );
}

ScreeningsPage.route = {
  path: "/ga-pa-bio",
  menuLabel: "Gå på bio",
  index: 2
};