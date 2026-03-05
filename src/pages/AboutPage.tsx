import { useEffect } from "react";
import { useLocation } from "react-router-dom";

function AboutPage() {
  const { hash } = useLocation();

  // Scrolla till hash när sidan laddas
  useEffect(() => {
    if (hash) {
      const el = document.querySelector(hash);
      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }
  }, [hash]);

  return (
    <div className="about-page">

      {/* HERO SECTION */}
      <section className="relative h-[45vh] md:h-[80vh] w-full overflow-hidden rounded-2xl -mb-10">
        <img
          src="/images/Commercials/biografhus.png"
          alt="Biograf"
          className="absolute inset-0 w-full h-full object-cover scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 to-black/20" />

        <div className="relative z-10 flex flex-col justify-end h-full px-6 max-w-6xl mx-auto pb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-white/75 drop-shadow-lg animate-fadeIn">
            Om oss
          </h1>
          <p className="text-lg md:text-xl text-white/75 mt-2 animate-fadeIn delay-150">
            En premium bioupplevelse i hjärtat av Malmö
          </p>
        </div>
      </section>

      {/* ABOUT SECTION */}
      <section className="w-full max-w-6xl mx-auto px-6 py-20">
        <div className="max-w-3xl space-y-8 leading-relaxed text-accent text-lg animate-fadeIn">
          <p className="text-xl md:text-2xl font-semibold text-accent">
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
      </section>

      {/* CINEMATIC IMAGE */}
      <section className="px-6 md:px-10 pb-20">
        <div className="max-w-6xl mx-auto overflow-hidden rounded-2xl shadow-2xl animate-fadeIn">
          <img
            src="/images/Commercials/salong1.png"
            alt="Biograf"
            className="w-full h-[350px] md:h-[550px] object-cover hover:scale-[1.05] transition-transform duration-700"
          />
        </div>
      </section>

      {/* INFÖR BESÖKET */}
      <section
        id="infor-besoket"
        className="scroll-mt-[100px] bg-surface-light py-15 px-6"
      >
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-semibold text-accent mb-12 animate-fadeIn">
            Inför ditt biografbesök
          </h2>

          {/* CARD LAYOUT */}
          <div className="grid md:grid-cols-3 gap-8">

            {/* Card 1 */}
            <div className="bg-white/5 backdrop-blur-sm p-6 rounded-xl shadow-md hover:shadow-xl transition animate-fadeIn">
              <h3 className="text-xl font-semibold mb-4 text-accent">Innan filmen</h3>
              <p className="text-accent leading-relaxed">
                Välkommen till vår biograf! Vi rekommenderar att du är på plats minst 15 minuter
                före filmstart. Då hinner du ta plats i lugn och ro samt köpa popcorn och dryck i
                vår kiosk.
              </p>
            </div>

            {/* Card 2 */}
            <div className="bg-white/5 backdrop-blur-sm p-6 rounded-xl shadow-md hover:shadow-xl transition animate-fadeIn delay-100">
              <h3 className="text-xl font-semibold mb-4 text-accent">Biljetter & betalning</h3>
              <p className="text-accent leading-relaxed">
                Biljetter köps smidigast online via vår webbplats, men kan även köpas på plats i
                kassan i mån av tillgång.
              </p>
            </div>

            {/* Card 3 */}
            <div className="bg-white/5 backdrop-blur-sm p-6 rounded-xl shadow-md hover:shadow-xl transition animate-fadeIn delay-200">
              <h3 className="text-xl font-semibold mb-4 text-accent">Regler & trivsel</h3>
              <p className="text-accent leading-relaxed">
                Vår biograf följer Statens medieråds åldersgränser och att barn endast får se filmer som är godkända för deras ålder.
                <p></p>Vi ber er stänga av mobilen under filmen. Fotografering och filmning är inte tillåtet.
                Biografen är tillgänglighetsanpassad — kontakta oss gärna i förväg vid särskilda
                behov. Slå dig ner och njut av filmen!
              </p>
            </div>

          </div>
        </div>
      </section>

    </div>
  );
}

/* ROUTE-DEFINITIONEN */
AboutPage.route = {
  path: "/om-oss",
  //menuLabel: "Om oss",
  index: 3
};

export default AboutPage;
