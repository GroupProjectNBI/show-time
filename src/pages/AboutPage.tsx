import { useEffect } from "react";
import { useLocation } from "react-router-dom";

function AboutPage() {
  const { hash } = useLocation();

  // ⭐ Scrolla till hash när sidan laddas
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

      {/* TEXT-CONTAINER */}
      <div className="w-full max-w-6xl mx-auto px-4 pt-10 pb-2">

        <h3 className="text-2xl font-semibold mb-6 text-accent">
          Om oss
        </h3>

        <div className="space-y-6 leading-relaxed text-accent max-w-4xl">
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

      </div>

      {/* BILD-CONTAINER */}
      <div className="mx-4 md:mx-12">
        <div className="max-w-6xl mx-auto px-6">
          <img
            src="/images/Commercials/cinema.webp"
            alt="Biograf"
            className="w-full rounded-none shadow-xl object-cover max-h-[350px]"
          />
        </div>
      </div>

      {/* INFÖR BESÖKET */}
      <div className="w-full max-w-6xl mx-auto px-4 pt-10 pb-2">
        <h3
          id="infor-besoket"
          className="scroll-mt-[100px] text-2xl font-semibold mb-6 text-accent"
        >
          Inför ditt biografbesök
        </h3>

        <div className="space-y-6 leading-relaxed text-accent max-w-4xl">
          <p>
            Välkommen till vår biograf! Vi ser fram emot att ge dig en härlig filmupplevelse - här
            hittar du all information du behöver inför ditt besök. Vi rekommenderar att du är på
            plats minst 15 minuter före filmstart. Då hinner du ta plats i lugn och ro samt köpa
            popcorn och dryck i vår kiosk.
          </p>

          <p>
            Biljetter köps smidigast online via vår webbplats, men kan även köpas på plats i kassan
            i mån av tillgång. Betalning sker på plats, vi är en kontantfri verksamhet. Observera
            att åldersgränser gäller enligt Statens medieråd och att barn endast får se filmer som
            är godkända för deras ålder.
          </p>

          <p>
            För allas trivsel ber vi dig att stänga av mobilen under filmens gång. Fotografering och
            filmning i salongen är inte tillåtet. Biografen är tillgänglighetsanpassad. Vid frågor
            om rullstolsplatser, hörslinga eller andra behov är du varmt välkommen att kontakta oss
            i förväg. Slå dig ner, luta dig tillbaka och njut av filmen – trevlig visning!
          </p>
        </div>
      </div>

    </div>
  );
}

/* ⭐ ROUTE-DEFINITIONEN — måste ligga efter komponenten */
AboutPage.route = {
  path: "/om-oss",
  menuLabel: "Om oss",
  index: 2
};

export default AboutPage;
