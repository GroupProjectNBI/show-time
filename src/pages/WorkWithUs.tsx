WorkWithUs.route = {
  path: '/jobba-hos-oss',
  menuLabel: 'Jobba hos oss',
  index: 3
};

export default function WorkWithUs() {
  return (
    <div className="w-full max-w-6xl mx-auto px-4 py-10">

      {/*hero-bild*/}
      <div className="w-full mb-10">
        <img
          src="/images/Commercials/workwithus-hero.webp"
          alt="Arbeta hos oss"
          className="w-full rounded-xl shadow-xl object-cover max-h-[380px]"
        />
      </div>

      {/* Rubrik */}
      <h1 className="text-3xl font-semibold text-center text-accent mb-8">
        Jobba hos oss
      </h1>

      {/* Textblock centrerat */}
      <div className="max-w-3xl mx-auto space-y-6 text-center leading-relaxed text-accent">

        <p>
          Hos oss är biobesöket mer än en film - det är en upplevelse.
          Vi arbetar i team för service, kvalitet och nöjda medarbetare.
        </p>

        <p>
          Att arbeta hos oss innebär att vara en del av ett team där glädje,
          tempo och professionalism spelar roll. Du arbetar nära service med
          värme och närvaro och bidrar till att varje besök känns personligt
          och genomtänkt.
        </p>

        <p>
          Dessutom är du en viktig del av helheten i salongen. Känns det rätt?
          I den bästa bioupplevelsen är du en central del av teamet.
        </p>

        <p>
          Vill du vara med och skapa minnesvärda biobesök?
          Välkommen att söka till vårt team.
        </p>
      </div>
      {/* Tre bilder under texten */}
      <div className="mt-12 grid grid-cols-1 sm:grid-cols-3 gap-6">

        <img src="/images/Commercials/cinema1.webp" alt="Biograf" className="w-full h-[220px] object-cover rounded-xl shadow-lg" />

        <img src="/images/Commercials/cinema2.webp" alt="Biograf" className="w-full h-[220px] object-cover rounded-xl shadow-lg" />

        <img src="/images/Commercials/cinema3.webp" alt="Biograf" className="w-full h-[220px] object-cover rounded-xl shadow-lg" />
      </div>
    </div>
  );
}