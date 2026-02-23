import type { ReactNode } from 'react';
import { createContext, useContext, useEffect, useState } from "react";
import fetchJson from "../utils/fetchJson";

// 1. Definiera typer
export interface User {
    id: string;
    userName: string;
    avatarUrl: number;
    email: string;
    role: string;
    avatar?: string;
}

// 2. Definiera Context-innehåll
interface AuthContextType {
    user: User | null;
    login: (credentials: any) => Promise<boolean>;
    logout: () => Promise<void>;
    create: (credentials: any) => Promise<boolean>;
    checkLogin: () => Promise<void>;
    changePassword: (newPassword: string) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Rättade stavfel: AutProvider -> AuthProvider
export function AuthProvider({ children }: { children: ReactNode; }) {
    const [user, setUser] = useState<User | null>(null);

    // 3. CheckLogin implementation
    async function checkLogin() {
        try {
            const response = await fetchJson("/api/login");
            if (response && response.email) {
                if (response.email) {
                    setUser(response);

                } else {
                    setUser(null);
                }
            } else {
                setUser(null);
            }
        } catch (error) {
            console.error("Login check failed:", error);
            setUser(null);
        }
    }

    // 4. Login implementation
    async function login(credentials: any) {
        try {
            const result = await fetchJson("/api/login", {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                // Använd credentials från anropet. 
                body: JSON.stringify(credentials)
            });

            if (result && result.email) {
                // Fetch avatar om user object och email i det objektet finns
                if (result.avatarUrl) {
                    try {
                        const avatarData = await fetchJson(`/api/Avatar?where=id=${result.avatarUrl}`);
                        if (avatarData && avatarData[0]) {
                            result.avatar = avatarData[0].url;
                        }
                    } catch (err) {
                        console.error("Kunde inte hämta avatar:", err);
                    }
                }
                setUser(result);
                return true; // Returnerar boolean true
            } else {
                setUser(null);
                return false; // Returnerar boolean false
            }
        } catch (error) {
            console.error("Login failed:", error);
            setUser(null);
            return false; // Returnerar boolean false vid krasch
        }
    }

    // Uppdatera create så den använder inskickad data
    async function create(credentials: any) {
        try {
            await fetchJson("/api/User", {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(credentials)
            });
            return true;
            // Här kan du välja att logga in användaren direkt eller bara returnera
        } catch (error) {
            console.error("Create user failed:", error);
            return false;
        }
    }

    // 5. Placeholder för Logout (Måste finnas för att matcha Interface)
    async function logout() {
        console.log("Logout inte implementerat än");
        fetchJson("/api/login", { method: 'DELETE' });
        setUser(null);
    }

    // 6. useEffect flyttad till roten av komponenten!
    useEffect(() => {
        checkLogin();
    }, []);

    //Change password
    function changePassword(newPassword: string) {
        console.log("Byter lösenord till:", newPassword);
        //TODO: implementera riktig API-logik
        //exempelvis 
        //await fetchJson("/api/cange-password", {
        // method: "POST", headers: {"Content-Type": "application/json"}, body: JSON.stringify({password: newPasswprd})});
    }

    const value = {
        user,
        login,
        logout,
        create,
        checkLogin,
        changePassword
    };

    // 7. Return flyttad till roten av komponenten!
    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
}

// Custom hook
export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
}