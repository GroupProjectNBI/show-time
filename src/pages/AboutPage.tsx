export default function AboutPage() {
  return (
    <div className="w-full max-w-5xl mx-auto px-4 py-8">

      {/* Rubrik */}
      <h3 className="text-xl font-semibold mb-4">Övrigt</h3>

      {/* Två kolumner på desktop, en kolumn på mobil */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

        {/* Vänster kolumn */}
        <div>
          <p className="mb-4"></p>
          <p className="leading-relaxed">
            Välkommen till vår biograf - en lokal mötesplats för filmälskare.
          </p>
        </div>

        {/* Höger kolumn */}
        <div className="space-y-4 leading-relaxed">
          <p>
            Vi är en småskalig biograf med två salonger, där fokus ligger på filmupplevelsen,
            gemensakpen och närheten till vår publik.
          </p>

          <p>
            Hos oss kan du se allt från aktuella storfilmer till utvalda visningar i en lugn och
            personlig miljö, tack vare våra två salonger kan vi erbjuda variation i programmet och
            skapa en bioupplevelse som passar både familjer, vänner och ensamma biobesökare.
          </p>

          <p>
            Som lokal biograf vill vi vara en del av området och bidra till kulturlivet. För oss
            handlar bio inte bara om film - det handlar om upplevelse som delas tillsammans.
          </p>

          {/* Bilden snyggt integrerad */}
          <img
            src="/images/Commercials/cinema.webp"
            alt="Biograf"
            className="w-full rounded-xl shadow-lg object-cover max-h-[260px]"
          />
        </div>

      </div>
    </div>
  );
}
