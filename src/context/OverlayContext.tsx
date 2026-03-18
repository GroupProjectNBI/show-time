//eftersom ConfirmationPage renderas av react-router kan jag inte hämta openMembership som props från App som header och footer gör..
//Därför finns det ingen ''förälder som kan skicka in prop direkt till ConfirmationPage

import { createContext, useContext } from "react";

type OverlayContextValue = {
  openMembership: () => void;
  openLogin: () => void;
  openAiChat: () => void; // Lagt till
};

const OverlayContext = createContext<OverlayContextValue | null>(null);

export function OverlayProvider({
  value,
  children,
}: {
  value: OverlayContextValue;
  children: React.ReactNode;
}) {
  return (
    <OverlayContext.Provider value={value}>
      {children}
    </OverlayContext.Provider>
  );
}

export function useOverlay() {
  const ctx = useContext(OverlayContext);
  if (!ctx) throw new Error("useOverlay måste användas inom OverlayProvidern");
  return ctx;
}
