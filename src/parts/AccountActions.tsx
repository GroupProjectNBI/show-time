interface AccountActionsProps {
  onLogout: () => void;
}

export default function AccountActions({ onLogout }: AccountActionsProps) {
  return (
    <div className="mt-12 border-t border-white/10 pt-8">
      <button
        onClick={onLogout}
        className="text-red-400 hover:text-red-200 transition"
      >
        Logga ut
      </button>
    </div>
  );
}
