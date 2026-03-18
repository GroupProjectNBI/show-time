import type { ReactNode } from 'react';
import { createContext, useContext, useEffect, useState } from "react";
import fetchJson from "../utils/fetchJson";

export interface User {
    id: string;
    userName: string;
    avatarUrl: number;
    email: string;
    role: string;
    avatar?: string;
}

interface AuthContextType {
    user: User | null;
    login: (credentials: any) => Promise<boolean>;
    logout: () => Promise<void>;
    create: (credentials: any) => Promise<boolean>;
    checkLogin: () => Promise<void>;
    updateAvatar: (avatarId: number) => Promise<boolean>;
    changePassword: (newPassword: string) => void;
    changeUserName: (value: string, role: string) => void;
    loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode; }) {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    async function hydrateAvatar(u: User): Promise<User> {
        if (!u?.avatarUrl) return u;
        try {
            const avatarData = await fetchJson(`/api/Avatar?where=id=${u.avatarUrl}`);
            if (avatarData && avatarData[0]) {
                return { ...u, avatar: avatarData[0].url };
            }
        } catch (err) {
            console.error("Kunde inte hämta avatar:", err);
        }
        return u;
    }

    async function checkLogin() {
        setLoading(true); // Visa att vi kollar
        try {
            const response = await fetchJson("/api/login"); // Detta är oftast en GET /api/login

            if (response && response.email) {
                const hydrated = await hydrateAvatar(response);
                setUser(hydrated);
            } else {
                setUser(null);
            }
        } catch (error) {
            console.error("Login check failed:", error);
            setUser(null);
        } finally {
            setLoading(false); // Nu är vi garanterat klara
        }
    }


    async function login(credentials: any) {
        try {
            const result = await fetchJson("/api/login", {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(credentials)
            });

            if (result && result.email) {
                const hydrated = await hydrateAvatar(result);
                setUser(hydrated);
                return true;
            } else {
                setUser(null);
                return false;
            }
        } catch (error: any) {
            // --- HÄR FIXAR VI BUGGEN ---
            // Om backend säger att vi redan är inloggade (500-felet du fick)
            if (error.message?.includes("already logged in") || error.status === 500) {
                await checkLogin(); // Hämta den existerande sessionen
                return true; // Vi räknar detta som en lyckad inloggning!
            }

            console.error("Login failed:", error);
            setUser(null);
            return false;
        }
    }




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


    async function logout() {
        fetchJson("/api/login", { method: 'DELETE' });
        setUser(null);
    }


    async function updateAvatar(avatarId: number): Promise<boolean> {
        if (!user) return false;
        try {
            // 1) Spara i DB
            await fetchJson(`/api/User/${user.id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ avatarUrl: avatarId }),
            });

            // 2) Uppdatera i appens "minne" så UI byter direkt
            const updatedUser: User = { ...user, avatarUrl: avatarId };
            const hydrated = await hydrateAvatar(updatedUser);
            setUser(hydrated);
            return true;
        } catch (error) {
            console.error("Update avatar failed:", error);
            return false;
        }
    }


    useEffect(() => {
        checkLogin();
    }, []);


    function changePassword(newPassword: string) {
        return newPassword;
    }


    async function changeUserName(value: string, role: string) {
        if (!user) return false;
        let changeValue;
        if (role == "name") changeValue = JSON.stringify({ userName: value });
        else changeValue = JSON.stringify({ email: value });

        await fetchJson(`/api/User/${user.id}`, {
            method: "PUT", headers: { "Content-Type": "application/json" }, body: changeValue
        });
    }

    const value = {
        user,
        login,
        logout,
        create,
        checkLogin,
        updateAvatar,
        changePassword,
        changeUserName,
        loading
    };


    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
}


export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
}
