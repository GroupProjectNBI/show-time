WorkWithUs.route = {
  path: '/jobba-hos-oss',
  index: -1 // ska inte synas i headern
};

export default function WorkWithUs() {
  return (
    <div className="workwithus-page">

      {/* HERO SECTION */}
      <section className="relative h-[45vh] md:h-[80vh] w-full overflow-hidden rounded-3xl mb-2">
        <img
          src="/images/Commercials/jobbahososs.png"
          alt="Arbeta hos oss"
          className="absolute inset-0 w-full h-full object-cover scale-110 rounded-3xl"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 to-black/20 rounded-3xl" />

        <div className="relative z-10 flex flex-col justify-end h-full px-6 max-w-6xl mx-auto pb-10">
          <h1 className="text-4xl md:text-5xl font-bold text-white/75 drop-shadow-lg animate-fadeIn">
            Jobba hos oss
          </h1>
          <p className="text-lg md:text-xl text-white/75 mt-2 animate-fadeIn delay-150">
            Bli en del av vårt team och skapa bioupplevelser som stannar kvar
          </p>

          {/* BUTTONS */}
          <div className="mt-6 flex flex-col sm:flex-row gap-4 animate-fadeIn delay-300">


            <button
              className="
            px-6 py-3 rounded-xl
            bg-accent text-primary font-semibold
            hover:bg-accent/90
            transition"
            >
              Lediga jobb
            </button>
          </div>
        </div>
      </section>

      {/* TEXT SECTION */}
      <section className="w-full max-w-6xl mx-auto px-6 py-12 pb-10">
        <div className="max-w-3xl space-y-8 leading-relaxed text-accent text-lg animate-fadeIn">

          {/* Första paragrafen – större, som AboutPage */}
          <p className="text-xl md:text-2xl font-semibold text-accent">
            Hos oss är biobesöket mer än en film - det är en upplevelse.
          </p>

          <p>
            Vi arbetar i team för service, kvalitet och nöjda medarbetare. Att arbeta hos oss innebär
            att vara en del av ett team där glädje, tempo och professionalism spelar roll.
          </p>

          <p>
            Du arbetar nära service med värme och närvaro och bidrar till att varje besök känns
            personligt och genomtänkt.
          </p>

          <p>
            Dessutom är du en viktig del av helheten i salongen. I den bästa bioupplevelsen är du en
            central del av teamet.
          </p>

          <p>
            Vill du vara med och skapa minnesvärda biobesök? Välkommen att söka till vårt team.
          </p>
        </div>
      </section>

      {/* IMAGE GRID */}
      <section className="w-full max-w-6xl mx-auto px-6 pb-5">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 animate-fadeIn">
          <img
            src="/images/Commercials/salong1.png"
            alt="Biograf"
            className="w-full h-[450px] object-cover rounded-2xl shadow-2xl hover:scale-[1.02] transition-transform duration-700"
          />
          <img
            src="/images/Commercials/salong2.png"
            alt="Biograf"
            className="w-full h-[450px] object-cover rounded-2xl shadow-2xl hover:scale-[1.02] transition-transform duration-700"
          />
        </div>
      </section>

    </div>
  );
}
