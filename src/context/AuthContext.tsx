import type { ReactNode } from 'react';
import { createContext, useContext, useEffect, useState } from "react";
import fetchJson from "../utils/fetchJson"; // Antar att denna returnerar ett Response-objekt

// 1. Definiera typer
export interface User {
    id: string;
    userName: string;
    avatarUrl: string;
    email: string;
    role: string;
}

// 2. Definiera Context-innehåll
interface AuthContextType {
    user: User | null;
    login: (credentials: any) => Promise<void>;
    logout: () => Promise<void>;
    checkLogin: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Rättade stavfel: AutProvider -> AuthProvider
export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null);

    // 3. CheckLogin implementation
    async function checkLogin() {
        try {
            const response = await fetchJson("/api/login");

            if (response.ok) {
                const result = await response.json();
                // OBS: Om fetchJson redan returnerar data, ta bort .json() ovan

                if (result.email) {
                    setUser(result);
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

    // 4. Placeholder för Login (Måste finnas för att matcha Interface)
    async function login(credentials: any) {
        console.log("Login inte implementerat än", credentials);
        // Här ska du sen göra din POST request
    }

    // 5. Placeholder för Logout (Måste finnas för att matcha Interface)
    async function logout() {
        console.log("Logout inte implementerat än");
        // Här ska du sen göra din DELETE request och sätta setUser(null)
    }

    // 6. useEffect flyttad till roten av komponenten!
    useEffect(() => {
        checkLogin();
    }, []);

    const value = {
        user,
        login,
        logout,
        checkLogin
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