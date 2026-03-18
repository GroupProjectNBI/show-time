

interface EmailFieldProps {
  initialValue: string;
}

export default function EmailField({ initialValue }: EmailFieldProps) {





  return (
    <div className="mb-8">
      <p className="text-sm text-accent/60 mb-1">Email</p>

      <div className="flex items-center gap-3">
        {/* INPUT */}
        <input
          type="email"
          value={initialValue}
          disabled={true}
          className="
            w-full rounded-xl bg-white/10 border border-white/20 px-4 py-2 text-accent placeholder-accent/40 focus:outline-none
            opacity-100"
          opacity-60="cursor-not-allowed" />


      </div>
    </div>

  );
}