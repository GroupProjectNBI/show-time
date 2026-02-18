FAQPage.route = {
  path: '/faq',
  // menuLabel: 'FAQ',
  index: 4
};

export default function FAQPage() {
  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-10">

      {/* Rubrik */}
      <h1 className="text-3xl font-semibold text-center text-accent mb-10">
        Vanliga frågor (FAQ)
      </h1>

      {/* FAQ-lista */}
      <div className="space-y-8 text-accent leading-relaxed">

        <div>
          <h3 className="text-lg font-semibold mb-1">Hur många salonger har ni?</h3>
          <p>Vi har två salonger som visar olika filmer och föreställningar.</p>
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-1">Vilka filmer visar ni?</h3>
          <p>
            Vi visar aktuella biofilmer samt utvalda visningar beroende på säsong och efterfrågan.
          </p>
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-1">Hur köper jag biljetter?</h3>
          <p>
            Biljetter kan köpas direkt via vår hemsida eller på plats i vår biograf innan
            föreställning, i mån av tillgänglighet. Notera att det endast går att betala på plats.
          </p>
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-1">
            Får jag ta med egen mat, snacks och dryck?
          </h3>
          <p>
            Tyvärr är det inte tillåtet att ta med egen mat, snacks eller dryck in i våra salonger.
            Men du är varmt välkommen att köpa godis, snacks, popcorn och dricka från vår kiosk.
          </p>
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-1">Är biografen barnvänlig?</h3>
          <p>
            Ja, vi visar filmer för alla åldrar. Åldersgränser följs enligt gällande regler.
          </p>
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-1">Är biografen tillgänglighetsanpassad?</h3>
          <p>
            Vi strävar efter att vara tillgängliga för alla. Kontakta oss gärna i förväg om du har
            särskilda behov.
          </p>
        </div>

      </div>



    </div>
  );
}
