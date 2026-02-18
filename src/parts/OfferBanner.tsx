export default function OfferBanner() {
  return (
    <section className="relative w-full h-[200px] sm:h-[230px] lg:h-[260px] rounded-3xl overflow-hidden">
     
      <img
        src="/images/Commercials/popga.jpg"
        alt="Popcorn offer"
        className="absolute inset-0 w-full h-full object-cover scale-[1.03] brightness-105 contrast-110 saturate-110"
     
     
      />

      {/* Overlay/läsbarhet*/}
      <div className="absolute inset-0 bg-gradient-to-r from-black/12 via-black/0 to-black/12" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/10 via-transparent to-black/6" />

      <div className="absolute inset-0 flex items-center justify-center px-4 sm:px-6">
        {/* Wrappern */}
        <div className="absolute w-full max-w-[600px] mx-auto h-[110px] sm:h-[130px] lg:h-[150px] rounded-[32px] bg-black/35 blur-xl" />

        <div
          className="
            relative w-full max-w-[700px]
            mx-auto rounded-[32px]
            px-6 py-1 sm:px-8 sm:py-2 lg:px-10 lg:py-3
            text-center
            bg-[#332a24]/55
            shadow-[0_20px_70px_rgba(0,0,0,0.55)]
            transition-transform duration-500
            hover:scale-[1.01]
          "
        >
          <h2
            className="
              text-[#e6c88c]
              text-4xl sm:text-5xl lg:text-6xl
              font-medium
              tracking-[0.12em]
              uppercase
              [text-shadow:0_2px_0_rgba(0,0,0,0.55)]
            "
          >
            ERBJUDANDE
          </h2>

          <div className="mx-auto mt-4 sm:mt-5 h-[2px] w-20 sm:w-24 bg-[#e6c88c]/55" />

          <p className="mt-5 text-[#e6c88c] text-base sm:text-lg leading-relaxed font-light [text-shadow:0_1px_0_rgba(0,0,0,0.65)]">
            Få rabatt på snackset när du förbokar en av våra menyer vid bokning av biljetter online,
            slipp sedan händerna fulla med popcorn skålar, läsk och biobiljetter.
          </p>

          <p className="mt-4 text-[#e6c88c] text-base sm:text-lg leading-relaxed font-light [text-shadow:0_1px_0_rgba(0,0,0,0.65)]">
            Vi serverar snackset hela vägen fram till stolarna!
          </p>
        </div>
      </div>
    </section>
  );
}
