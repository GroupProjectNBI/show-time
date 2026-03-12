import JobCard from "../parts/JobCard";


WorkApplication.route = {
  path: '/lediga-jobb',
  index: -1 // ska inte synas i headern
};

export default function WorkApplication() {
  return (
    <div className="workapplication-page">

      {/*HERO SECTION */}
      <section className="relative h-[45vh] md:h-[80vh] w-full overflow-hidden rounded-3xl mb-2">
        <img
          src="/images/Commercials/jobbahososs.png"
          alt="Arbete hos oss"
          className="absolute inset-0 w-full h-full object-cover scale-110 rounded-3xl"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 to-black/20 rounded-3xl" />

        <div className="relative z-10 flex flex-col justify-end h-full px-6 max-w-6xl mx-auto pb-10">
          <h1 className="text-4xl md:text-5xl font-bold text-white/75 drop-shadow-lg animate-fadeIn">
            Lediga jobb
          </h1>
          <p className="text-lg md:text-xl text-white/75 mt-2 animate-fadeIn delay-150">
            Bli en del av vårt team och skapa bioupplevelser som stannar kvar
          </p>



        </div>
      </section>

      {/*TEXT SECTION*/}
      <section className="w-full max-w-6xl mx-auto px-6 py-12 pb-10">
        <div className="max-w-3xl space-y-8 leading-relaxed text-accent text-lg animate-fadeIn">

          {/*Första paragrafen - större*/}
          <p className="text-xl md:text-2xl font-semibold text-accent">
            Hos oss är biobesöket mer än en film - det är en upplevelse.
          </p>

          <p>
            Vi arbetar i team för service, kvalitet och nöjda medarbetare. Att arbeta hos oss innebär att vara en del av ett team där glädje, tempo och professionalism spelar roll.
          </p>

          <p>
            Vill du vara med och skapa minnesvärda biobesök? Se våra lediga jobb och ansök redan idag.
          </p>
        </div>
      </section>
      {/* LEDIGA JOBB */}
      <section className="w-full max-w-6xl mx-auto px-6 pb-20">
        <h2 className="text-3xl font-bold text-accent mb-8">
          Lediga tjänster
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

          {/* Spontanansökan – ENDA ANNONSEN JUST NU */}
          <JobCard
            title="Spontanansökan"
            description="Vi söker alltid engagerade personer som vill vara en del av vårt team. Skicka in en spontanansökan så hör vi av oss när en tjänst matchar din profil."
            link="/faq#kontakt"
            buttonLabel="Kontaktformulär"
          />


        </div>
      </section>

    </div>
  );
}