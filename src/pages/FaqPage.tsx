import { useState } from "react";
FAQPage.route = {
  path: "/faq",
  index: -1
};

export default function FAQPage() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toogle = (i: number) => {
    setOpenIndex(openIndex === i ? null : i);
  };

  const faqs = [
    {
      q: "Hur många salonger har ni?",
      a: "Vi har två salonger som visar olika filmer och föreställningar."
    },
    {
      q: "Vilka filmer visar ni?",
      a: "Vi visar aktuella biofilmer, samt utvalda visingar beroende på säsong och efterfrågan."
    },
    {
      q: "Hur köper jag biljetter?",
      a: "Biljetter kan köpas via vår hemsida eller på plats innan föreställning."
    },
    {
      q: "Får jag ta med egen mat, snacks och dryck?",
      a: "Det är inte tillåtet att ta med egen mat eller dryck. Vi erbjuder snacks, popcorn och dryck i vår kiosk."
    },
    {
      q: "Är biografen barnvänlig?",
      a: "Ja, vi visar filmer för alla åldrar och följer gällande åldersgränser."
    },
    {
      q: "Är biografen tillgänglighetsanpassad?",
      a: "Ja, kontakta oss gärna i förväg om du har särskilda behov."
    }
  ];

  const categories = [
    "Biobiljetter",
    "Tillgänglighet",
    "Villkor och policies",
    "På biografen",
    "Medlemskap",
    "Övriga frågor",
    "Program och filmfrågor",
    "Om Show-Time"
  ];

  return (
    <div className="w-full max-w-6xl mx-auto px-6 py-16">

      {/* INTRO SECTION */}
      <div className="text-center mb-16">
        <h1 className="text-4xl md:text-5xl font-bold text accent mb-4">
          Fågor & Svar
        </h1>
        <p className="text-lg md:text-xl text-accent/80 max-w-2xl mx-auto">
          Välkommen till oss på KundService! Vad behöver du hjälp med?
        </p>

        <button className="
        mt-6 px-6 py-3 rounded-xl
        bg-accent text-primary font-semibold
        hover:bg-accent/90 transition
        ">
          Chatta med oss
        </button>
      </div>

      {/* TWO-COLUMN LAYOUT*/}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-20">

        {/*LEFT: FAQ ACCORDION*/}
        <div className="space-y-4">
          {faqs.map((item, i) => {
            const isOpen = openIndex === i;
            return (
              <div
                key={i}
                className="bg-white/5 border border-white/10 rounded-xl p-4 cursor-pointer transition hover:bg-white/10"
                onClick={() => toogle(i)}
              >
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-accent">
                    {item.q}
                  </h3>

                  <span className="text-accent text-2xl font-bold">
                    {isOpen ? "-" : "+"}
                  </span>
                </div>

                {isOpen && (
                  <p className="mt-3 text-accent/80 leadning-relaxed">
                    {item.a}
                  </p>
                )}
              </div>
            );
          })}
        </div>

        {/*RIGHT: HERO IAMGE */}
        <div>
          <div className="w-full h-[475px] rounded-3xl overflow-hidden shadow-2xl">
            <img
              src="/images/Commercials/FAQimage.png"
              alt="FAQ Hero"
              className="w-full h-full object cover"
            />
          </div>
        </div>
      </div>

      {/*CATEGORY BUTTONS */}
      <div className="mb-16">
        <h2 className="text-2xl font-semibold text-accent mb-6">
          Fler frågor och svar
        </h2>

        <div className="flex flex-wrap gap-4">
          {categories.map((cat, i) => (
            <button
              key={i}
              className="
            px-5 py-2 rounded-xl
            bg-white/5 border border-white/10
            text-accent font-medium
            hover:bg-white/10 transition
            "
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/*CONTACT FORM */}
      <div className="bg-white/5 border border-white/10 rounded-3xl p-8 shadow-xl">
        <h2 className="text-2xl font-semibold text-accent mb-6">
          Kontakta oss
        </h2>

        <form className="space-y-6">
          <div>
            <label className="block text-accent mb-1">Namn</label>
            <input
              type="text"
              className="w-full px-4 py-2 rounded-xl bg-white/10 border border-white/20 text-accent focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-accent mb-1">Email</label>
            <input
              type="email"
              className="w-full px-4 py-2 rounded-xl bg-white/10 border border-white/20 text-accent focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-accent mb-1">Meddelande</label>
            <textarea
              rows={4}
              className="w-full px-4 py-2 rounded-xl bg-white/10 border border-white/20 text-accent focus:outline-none"
            ></textarea>
          </div>

          <button
            type="submit"
            className="
          px-6 py-3 rounded-xl
          bg-accent text-primary font-semibold
          hover:bg-accent/90 transition
          "
          >
            Skicka
          </button>
        </form>
      </div>
    </div>
  );
}