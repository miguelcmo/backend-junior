import { useState } from "react";
import { AuthContext } from "./AuthContext"

export const AuthProvider = ({ children }) => {

    const [user, setUser] = useState(() => {
        const token = localStorage.getItem("token");

        if (token) {
            try {
                return JSON.parse(atob(token.split('.')[1]));
            } catch {
                return null;
            }
        }

        return null;
    });

    const login = (token) => {
        localStorage.setItem("token", token);

        try {
            const payload = JSON.parse(atob(token.split('.')[1]));
            setUser(payload); // 🔥 esto es lo que te falta
        } catch {
            setUser(null);
        }
    };

    const logout = () => {
        localStorage.removeItem("token");
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};