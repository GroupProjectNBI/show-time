import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function ProtectedRoute({ children }: { children: React.ReactNode; }) {
  const { user, loading } = useAuth();

  // 1. Om vi fortfarande kollar auth-status, visa en laddningsskärm
  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-primary">
        <p className="text-accent animate-pulse">Kontrollerar inloggning...</p>
      </div>
    );
  }

  // 2. Om laddningen är klar och vi INTE har en användare, skicka hem dem
  if (!user) {
    return <Navigate to="/" replace />;
  }

  // 3. Annars, välkommen in!
  return <>{children}</>;
}
