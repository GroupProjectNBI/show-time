type LoginOverlayProps = {
  onClose: () => void;
};


export default function LoginOverlay({ onClose }: LoginOverlayProps) {
  return (
    <div className="
    fixed inset-0 z-[9999]
    flex items-center justify-center
    backdrop-blur-xl bg-black/60
    animate-fadeIn
    p-4
    ">
      <div className="
      relative
      w-[90%] max-w-md
      bg-primary/90
      rounded-3xl
      p-8
      shadow-2xl
      border border-white/10
      ">
        {/*CLOSE BUTTON */}
        <button onClick={onClose} className="absolute top-6 right-6 text-accent text-4xl font-light hover:text-accent/80 transition">
          *
        </button>

        {/*CIRCLE*/}
        <div className="flex justify-center gap-4 mb-8">
          <div className="w-16 h-16 rounded-full bg-white/10 border border-white/20" />
        </div>
        {/*INPUTS*/}
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
            <label className="block text-accent mb-1 font-semibold">Lösenord</label>
            <input
              type="password"
              className="w-full rounded-xl bg-white/20 border border-white/20 px-4 py-2 text-accent placeholder-accent/40 focus:outline-none"
              placeholder="******"
            />
          </div>
        </div>
        {/*BUTTON*/}
        <button className="
        w-full mt-8 py-3 rounded-xl
        bg-red-600 text-white font-semibold
        hover:bg-red-700 transition
        ">
          Logga in
        </button>
      </div>
    </div>
  );
}