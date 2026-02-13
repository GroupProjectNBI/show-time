import { useState } from "react";
import ScreeningsList from "../parts/ScreeningsList";
import DateDropdown from "../parts/DateDropDown";
import type { Screening } from "../interfaces/Screenings";

function ScreeningsPage() {
  const screenings: Screening[] = []; // empty for now, will add mockdata
  const [selectedDateISO, setSelectedDateISO] = useState<string | null>(null);

  return (
    <div className="min-h-screen pt-8">
      <div className="mx-auto w-[min(1200px,calc(100%-32px))]">
        {/* TITLE */}
        <div className="mb-8">
          <h1 className="text-2xl font-semibold text-accent">Gå på bio</h1>
          <br />
          <p className="mt-1 text-accent/70">
            Välkommen till oss! Med ett brett utbud av filmer kan du njuta av allt från de senaste bioreleaserna till tidlösa klassiker i världsklass. Oavsett om du är ute efter spänning, romantik, skratt eller äventyr har vi något som passar just dig. Utforska vårt utbud och hitta din nästa filmupplevelse redan idag – börja med att söka här nedan.
          </p>
          <br />
        </div>

        {/* FILTER ROW (responsive) */}
        <div className="mb-6 flex flex-col gap-3 md:flex-row md:items-center md:gap-4">
          <DateDropdown
            valueISO={selectedDateISO}
            onChange={setSelectedDateISO}
            placeholder="Välj dag & datum"
          />

          {/* FILTER BUTTON primary color */}
          <button className="w-full rounded-xl bg-primary px-10 py-2 text-sm font-semibold text-accent transition hover:opacity-90 md:w-auto">
            Filtrera
          </button>

          <button className="w-full rounded-xl bg-white/10 px-5 py-2 text-sm font-semibold text-accent transition hover:bg-white/15 md:ml-auto md:w-auto">
            Sök
          </button>
        </div>

        {/* TABLE HEADER for desktop row over movies time, title and theater */}
        <div className="hidden md:grid md:grid-cols-[140px_1fr_280px] md:border-b md:border-white/10 md:pb-3 md:text-sm md:font-semibold md:text-accent/70">
          <div>Klockslag</div>
          <div>Titel</div>
          <div>Salong</div>
        </div>

        {/* LIST */}
        <div className="divide-y divide-white/10">
          <ScreeningsList screenings={screenings} />
        </div>

        {/* bottom spacing */}
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

export default ScreeningsPage;
