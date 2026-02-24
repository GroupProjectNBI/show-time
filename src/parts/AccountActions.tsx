interface AccountActionsProps {
  onLogout: () => void;
}

export default function AccountActions({ onLogout }: AccountActionsProps) {
  return (
    <div className="mt-16 border-t border-white/10 pt-10 flex justify-center">
      <button
        onClick={onLogout}
        className="
          px-6 py-2 
          rounded-full 
          border border-red-500 
          text-red-400 
          font-semibold
          hover:bg-red-600 hover:text-white 
          transition
        "
      >
        Logga ut
      </button>
    </div>
  );
}
