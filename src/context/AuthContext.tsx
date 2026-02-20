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
    login: (credentials: any) => Promise<void>;
    logout: () => Promise<void>;
    create: (credentials: any) => Promise<void>;
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

    // 4. Placeholder för Login (Måste finnas för att matcha Interface)
    async function login(credentials: any) {
        console.log("Login inte implementerat än", credentials);
        const login = await fetchJson("/api/login", {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ "email": "jail@example.com", "password": "123456789" })

        });

        if (login.email) {
            // fetch avatar
            if (login.avatarUrl) {
                // fetch avatar genom id och returnerar objektet istället för arrayn, Här förutsätter vi att vi bara får ett svar 
                const avatarURL = await fetchJson(`/api/Avatar?where=id=${login.avatarUrl}`).then(res => res[0]);
                login.avatar = avatarURL.url;
            }
            console.log(login);
            setUser(login);
        }
        else {
            setUser(null);
        }

    }


    async function create(credentials: any) {
        console.log("Create user inte implementerat än", credentials);
        await fetchJson("/api/User", {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ "email": "jail@example.com", "userName": "Fantomen", "avatarUrl": 3, "password": "123456789" })
        });
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