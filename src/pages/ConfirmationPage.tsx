import { Link } from "react-router-dom";

function ConfirmationPage() {
  return (
    /* flex-grow ser till att innehållet hamnar i mitten mellan Header och Footer */
    <div className="flex-grow flex items-center justify-center px-4 py-20 text-white">
      <div className="max-w-2xl w-full text-center space-y-8">
        
        {/* TITEL */}
        <h1 className="text-2xl font-bold uppercase tracking-wide">
          Tack för din reservation!
        </h1>

        {/* TEXTEN FRÅN DIN BILD */}
        <div className="space-y-6 text-lg leading-relaxed opacity-90 font-medium">
          <p>
            Du kommer strax att få en bekräftelse via e-post med dina orderdetaljer.
          </p>

          <p>
            Vid eventuella frågor är du välkommen att kontakta oss via (länk).
          </p>

          <p>
            Dina platser är reserverade fram tills en timme före filmens start.
          </p>

          <p>
            Du kan även se dina biljetter på Min sida genom att logga in eller bli medlem.
          </p>
        </div>

        {/* RÖD KNAPP (Flyttad till höger som i Figma) */}
        <div className="pt-4 flex justify-end">
          <Link 
            to="/login" 
            className="bg-[#D00027] hover:bg-[#a0001e] text-white font-bold py-3 px-10 rounded-md transition-all uppercase text-sm"
          >
            Bli medlem
          </Link>
        </div>

      </div>
    </div>
  );
}

// Sätter inställningarna för routern
ConfirmationPage.route = {
  path: "/confirmation", 
  menuLabel: "Confirmation",
  hideInMenu: true, // Detta döljer den från menyn så att de andras knappar inte flyttas
  index: -2

};

export default ConfirmationPage;