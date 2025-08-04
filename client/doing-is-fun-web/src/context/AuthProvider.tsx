import { useEffect, useState } from "react";
import { AuthContext } from "./AuthContext";
import type { User } from "../types/auth";
import { getProfile, refreshAccessToken } from "../api/auth";
export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const [accessToken, setAccessToken] = useState<string | null>(null);

    useEffect(() => {
        async function tryRefresh() {
            try {
                const { accessToken } = await refreshAccessToken();
                setAccessToken(accessToken);

                const user = await getProfile(accessToken);
                setUser(user);
            }
            catch (err) {
                console.warn("Auto-login failed:", err);
                setUser(null);
            }
            finally {
                setLoading(false)
            }
        }
        tryRefresh();
    }, [])

    return (
        <AuthContext.Provider value={{ user, setUser, accessToken, setAccessToken, loading }}>
            {children}
        </AuthContext.Provider>
    );
}
