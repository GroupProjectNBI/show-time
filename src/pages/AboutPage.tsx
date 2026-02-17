AboutPage.route = {
  path: '/om-oss',
  menuLabel: 'Om oss',
  index: 2
};

export default function AboutPage() {
  return (
    <div className="w-full max-w-3xl mx-auto px-4 py-10">

      {/* Rubrik */}
      <h3 className="text-2xl font-semibold mb-6 text-center">Om oss</h3>

      {/* Texten centrerad och i en kolumn */}
      <div className="space-y-6 leading-relaxed text-center">

        <p>
          Välkommen till vår biograf - en lokal mötesplats för filmälskare.
        </p>

        <p>
          Vi är en småskalig biograf med två salonger, där fokus ligger på filmupplevelsen,
          gemenskapen och närheten till vår publik.
        </p>

        <p>
          Hos oss kan du se allt från aktuella storfilmer till utvalda visningar i en lugn och
          personlig miljö. Tack vare våra två salonger kan vi erbjuda variation i programmet och
          skapa en bioupplevelse som passar både familjer, vänner och ensamma biobesökare.
        </p>

        <p>
          Som lokal biograf vill vi vara en del av området och bidra till kulturlivet. För oss
          handlar bio inte bara om film - det handlar om upplevelser som delas tillsammans.
        </p>

      </div>

      {/* Bilden under texten */}
      <div className="mt-10 flex justify-center">
        <img
          src="/images/Commercials/cinema.webp"
          alt="Biograf"
          className="w-full max-w-3xl rounded-xl shadow-xl object-cover max-h-[350px]"
        />
      </div>

    </div>
  );
}
