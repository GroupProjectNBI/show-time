import { useState } from "react";

interface PasswordDisplayProps {
  password: string;
}

export default function PasswordDisplay({ password }: PasswordDisplayProps) {
  const [visible, setVisible] = useState(false);

  return (
    <div className="mb-6">
      <p className="text-sm text-accent/60">Lösenord</p>

      <div className="flex items-center gap-3">
        <p className="text-lg">
          {visible ? password : "********"}
        </p>

        <button
          onClick={() => setVisible(!visible)}
          className="text-accent/60 hover:text-accent transition"
        >
          {visible ? "Dölj" : "Visa"}
        </button>
      </div>
    </div>
  );
}
