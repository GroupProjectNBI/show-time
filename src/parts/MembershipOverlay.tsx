type MembershipOverlayProps = {
  onClose: () => void;
};


export default function MembershipOverlay({ onClose }: MembershipOverlayProps) {
  return (
    <div className="
    fixed inset-0 z-[9999]
    flex items-center jusify-center
    backdrop-blur-xl bg-black/60
    animate-fadeIn
    ">
      <div className="
      w-[90%] max-w-md
      bg-primary/90
      rounded-3xl
      p-8
      shadow-2xl
      border border-white/10
      ">

        {/*Circles */}
        <div className="flex jusify-center gap-4 mb-8">
          <div className="w-16 h16 rounded-full bg-white/10 border border-white/20" />
          <div className="w-16 h16 rounded-full bg-white/10 border border-white/20" />
          <div className="w-16 h16 rounded-full bg-white/10 border border-white/20" />
        </div>

        {/* Inputs */}
        <div className="space-y-5">
          <div>
            <label className="block text-accent mb-1 font-semibold">Användarnamn</label>
            <input
              type="text"
              className="w-full rounded-xl bg-white/10 border border-white/20 px-4 py-2 text-accent placeholder-accent/40 focus:outline-none"
              placeholder="Ditt användarnamn"
            />
          </div>

          <div>
            <label className="block text-accent mb-1 font-semibold">Email adress</label>
            <input
              type="email"
              className="w-full rounded-xl bg-white/10 border border-white/20 px-4 py-2 text-accent placeholder-accent/40 focus:outline-none"
              placeholder="Din email"
            />
          </div>

          <div>
            <label className="block text-accent mb-1 font-semi">Lösenord</label>
            <input
              type="password"
              className="w-full rounded-xl bg-white/10 border border-white/20 px-4 py-2 text-accent placeholder-accent/40 focus:outline-none"
              placeholder="******"
            />
          </div>

          <div>
            <label className="block text-accent mb-1 font-semibold">Upprepa lösenord</label>
            <input
              type="password"
              className="w-full rounded-xl bg-white/10 border border-white/20 px-4 py-2 text-accent placeholder-accent/40 focus:outline-none"
              placeholder="******"
            />
          </div>
        </div>

        {/* Button */}
        <button className="
        w-full mt-8 py-3 rounded-xl
        bg-red-600 text-white font-semibold
        hover:bg-red-700 transition
        ">
          Bli medlem
        </button>
      </div>
    </div>
  );
}