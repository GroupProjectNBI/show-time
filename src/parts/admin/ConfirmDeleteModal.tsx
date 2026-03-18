export default function ConfirmDeleteModal({ target, onClose, onConfirm }: any) {
  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
      <div className="bg-[#1a1a1a] p-6 rounded-lg w-full max-w-sm">
        <h3 className="text-xl text-white font-semibold mb-4">
          Ta bort personal?
        </h3>

        <p className="text-gray-300 mb-6">
          Är du säker på att du vill ta bort{" "}
          <span className="font-semibold">
            {target.firstName} {target.lastName}
          </span>
          ?
        </p>

        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            className="text-gray-300 hover:underline"
          >
            Avbryt
          </button>

          <button
            onClick={onConfirm}
            className="bg-red-500 text-white px-4 py-2 rounded font-semibold"
          >
            Ta bort
          </button>
        </div>
      </div>
    </div>
  );
}
