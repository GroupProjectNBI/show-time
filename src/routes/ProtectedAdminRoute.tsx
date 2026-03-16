import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import React from "react";


export default function ProtectedAdminRoute({ children }: { children: React.ReactNode; }) {
  const { user, loading } = useAuth();

  // Vänta tills AuthContext är färdigladdat
  if (loading) {
    return null; // eller en spinner om du vill
  }

  // Inte inloggad → skicka till login
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Inloggad men inte admin → skicka till startsidan
  if (user.role !== "admin") {
    return <Navigate to="/" replace />;
  }

  // Admin → släpp igenom
  return children;
}
