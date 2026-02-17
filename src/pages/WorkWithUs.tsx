WorkWithUs.route = {
  path: '/jobba-hos-oss',
  menuLabel: 'Jobba hos oss',
  index: 3
};

export default function WorkWithUs() {
  return (
    <div className="w-full max-w-8xl mx-auto px-2 py-4">

      {/*hero-bild*/}
      <div className="w-full mb-8">
        <img
          src="/images/Commercials/jobbahososs.png"
          alt="Arbeta hos oss"
          className="w-full rounded-xl shadow-xl object-cover max-h-[600px]"
        />
      </div>

      {/* Rubrik */}
      <h1 className="text-3xl font-semibold text-left text-accent mb-8">
        Jobba hos oss
      </h1>

      {/* Textblock centrerat */}
      <div className="max-w-1xl mx-auto space-y-6 text-left leading-relaxed text-accent">

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
      {/* Två bilder under texten */}
      <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 gap-4 justify-center">

        <img src="/images/Commercials/salong1.png" alt="Biograf" className="w-full h-[500px] object-cover rounded-xl shadow-lg" />
        <img src="/images/Commercials/salong2.png" alt="Biograf" className="w-full h-[500px] object-cover rounded-xl shadow-lg" />


      </div>
    </div>
  );
}