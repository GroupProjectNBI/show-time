import { useState, useEffect, useMemo } from "react";
import fetchJson from "../utils/fetchJson";
import ScreeningsList from "../parts/ScreeningsList";
import DateDropdown from "../parts/DateDropdown";
import type { Screening } from "../interfaces/Screenings";
import { formatDate } from "../utils/formatTime";
import { Filter, ArrowUpDown, X } from "lucide-react";

export default function ScreeningsPage() {
  // --- STATE ---
  const [allScreenings, setAllScreenings] = useState<Screening[]>([]);
  const [loading, setLoading] = useState(true);

  // Datum
  const [selectedDateISO, setSelectedDateISO] = useState<string>(formatDate(new Date()));

  // UI Toggle
  const [showFilters, setShowFilters] = useState(false);

  // Filter & Sortering
  const [filters, setFilters] = useState({
    movie: "",
    category: "",
    theater: "",
  });
  const [sortOrder, setSortOrder] = useState("dateAsc");

  // --- HÄMTA DATA ---
  useEffect(() => {
    async function loadData() {
      // Hämta allt sorterat på tid
      const url = `/api/v_screenings?orderby=startTime`;
      const data = await fetchJson(url);

      if (data && !data.error) {
        setAllScreenings(data);
      }
      setLoading(false);
    }
    loadData();
  }, []);

  // --- DYNAMISKA LISTOR ---
  const uniqueMovies = useMemo(() =>
    Array.from(new Set(allScreenings.map(s => s.movieTitle))).sort(),
    [allScreenings]);

  const uniqueTheaters = useMemo(() =>
    Array.from(new Set(allScreenings.map(s => s.theaterName))).sort(),
    [allScreenings]);

  // FIX: Kategorier (Splittar "Action, Drama" till unika värden)
  const uniqueCategories = useMemo(() => {
    const cats = new Set<string>();
    allScreenings.forEach(s => {
      // Hantera olika namn i databasen (categories eller genre)
      const catString = (s as any).categories || (s as any).genre;
      if (catString) {
        // Splitta på kommatecken och ta bort mellanslag
        catString.split(",").forEach((c: string) => cats.add(c.trim()));
      }
    });
    return Array.from(cats).sort();
  }, [allScreenings]);

  // --- FILTRERINGSLOGIK (Här är magin!) ---
  const processedScreenings = useMemo(() => {
    let result = [...allScreenings];

    // 1. FILM & DATUM LOGIK (Det du frågade om)
    if (filters.movie) {
      // OM en film är vald -> Visa ALLA datum för den filmen (Ignorera datumväljaren)
      result = result.filter(s => s.movieTitle === filters.movie);
    } else {
      // OM ingen film är vald -> Använd datumväljaren
      if (selectedDateISO) {
        result = result.filter(s => s.startTime.startsWith(selectedDateISO));
      }
    }

    // 2. KATEGORI (Kollar om vald kategori finns i strängen)
    if (filters.category) {
      result = result.filter(s => {
        const catString = (s as any).categories || (s as any).genre || "";
        return catString.includes(filters.category);
      });
    }

    // 3. SALONG
    if (filters.theater) {
      result = result.filter(s => s.theaterName === filters.theater);
    }

    // 4. SORTERING
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

  // --- HANDLERS ---
  const handleFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const clearFilters = () => {
    setFilters({ movie: "", category: "", theater: "" });
    setSortOrder("dateAsc");
    // Om du vill återställa datumet till idag när man rensar:
    // setSelectedDateISO(formatDate(new Date()));
  };

  // CSS-klasser för inputs
  const inputClass = "w-full bg-[#1a1a1a] text-white border border-white/10 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-[#c0a060] transition-colors appearance-none cursor-pointer";

  return (
    <div className="min-h-screen pt-8 pb-20">
      <div className="mx-auto w-[min(1200px,calc(100%-32px))]">

        {/* HEADER */}
        <div className="mb-8 border-b border-white/10 pb-6">
          <h1 className="text-2xl font-semibold text-accent">Gå på bio</h1>
          <p className="mt-1 text-accent/70 max-w-3xl">
            Välkommen! Utforska vårt utbud och hitta din nästa filmupplevelse.
          </p>
        </div>

        {/* KONTROLLPANEL */}
        <div className="mb-6 flex flex-col gap-3 md:flex-row md:items-center md:gap-4">

          {/* Datumväljare (Inaktiverad om film är vald för tydlighetens skull, valfritt) */}
          <div className={filters.movie ? "opacity-50 pointer-events-none grayscale" : ""}>
            <DateDropdown
              valueISO={selectedDateISO}
              onChange={setSelectedDateISO}
            />
          </div>

          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`
              w-full md:w-auto rounded-xl px-10 py-2 text-sm font-semibold text-accent transition flex items-center justify-center gap-2
              ${showFilters ? 'bg-primary ring-2 ring-white/20' : 'bg-primary hover:opacity-90'}
            `}
          >
            <Filter size={16} />
            {showFilters ? "Göm filter" : "Filtrera"}
          </button>

          {/* <span className="hidden md:block ml-auto text-sm text-accent/50 italic">
            
            text Sök knapp
          </span> */}
        </div>

        {/* FILTERPANEL */}
        {showFilters && (
          <div className="mb-8 bg-[#232323] border border-white/10 rounded-xl p-6 shadow-lg animate-in fade-in slide-in-from-top-2">

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">

              {/* Film Select */}
              <div>
                <label className="text-[10px] text-white/40 uppercase tracking-wider mb-1 block">Film</label>
                <div className="relative">
                  <select name="movie" value={filters.movie} onChange={handleFilterChange} className={inputClass}>
                    <option value="">Alla filmer</option>
                    {uniqueMovies.map(m => <option key={m} value={m}>{m}</option>)}
                  </select>
                </div>
              </div>

              {/* Genre Select */}
              <div>
                <label className="text-[10px] text-white/40 uppercase tracking-wider mb-1 block">Genre</label>
                <div className="relative">
                  <select name="category" value={filters.category} onChange={handleFilterChange} className={inputClass}>
                    <option value="">Alla genrer</option>
                    {uniqueCategories.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
              </div>

              {/* Salong Select */}
              <div>
                <label className="text-[10px] text-white/40 uppercase tracking-wider mb-1 block">Salong</label>
                <div className="relative">
                  <select name="theater" value={filters.theater} onChange={handleFilterChange} className={inputClass}>
                    <option value="">Alla salonger</option>
                    {uniqueTheaters.map(t => <option key={t} value={t}>{t}</option>)}
                  </select>
                </div>
              </div>

              {/* Sortering */}
              <div>
                <label className="text-[10px] text-white/40 uppercase tracking-wider mb-1 block">Sortera</label>
                <div className="relative">
                  <select value={sortOrder} onChange={(e) => setSortOrder(e.target.value)} className={inputClass}>
                    <option value="dateAsc">Tid (Tidigast)</option>
                    <option value="nameAsc">Namn (A-Ö)</option>
                    <option value="lengthDesc">Längd (Längst)</option>
                  </select>
                  <ArrowUpDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 pointer-events-none" />
                </div>
              </div>
            </div>

            {/* Rensa Knapp */}
            {(filters.movie || filters.category || filters.theater) && (
              <div className="mt-4 flex justify-end">
                <button onClick={clearFilters} className="text-red-400 hover:text-red-300 text-xs flex items-center gap-1 hover:underline">
                  <X size={14} /> Rensa val
                </button>
              </div>
            )}
          </div>
        )}

        {/* TABELLRUBRIKER */}
        <div className="hidden md:grid md:grid-cols-[140px_1fr_280px] md:border-b md:border-white/10 md:pb-3 md:text-sm md:font-semibold md:text-accent/70">
          <div>Klockslag</div>
          <div>Titel</div>
          <div>Salong</div>
        </div>

        {/* LISTA */}
        <div className="divide-y divide-white/10">
          {loading ? (
            <p className="py-10 text-center text-accent/50">Laddar visningar...</p>
          ) : (
            <ScreeningsList screenings={processedScreenings} />
          )}
        </div>

        <div className="h-10" />
      </div>
    </div>
  );
}

ScreeningsPage.route = {
  path: "/screenings",
  menuLabel: "Gå på bio",
  index: 2
};