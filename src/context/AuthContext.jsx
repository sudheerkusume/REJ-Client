import { createContext, useState, useEffect, useContext } from "react";

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [token, setToken] = useState("");
    const [role, setRole] = useState("");
    const [user, setUser] = useState(null);

    useEffect(() => {
        const savedToken = localStorage.getItem("authToken");
        const savedRole = localStorage.getItem("authRole");
        if (savedToken) {
            setToken(savedToken);
            setRole(savedRole || "");
        }
    }, []);

    const login = (newToken, newRole, userData) => {
        setToken(newToken);
        setRole(newRole);
        setUser(userData);

        // Store unified keys
        localStorage.setItem("authToken", newToken);
        localStorage.setItem("authRole", newRole);

        // Legacy keys for backward compat during migration
        if (newRole === "user") localStorage.setItem("userToken", newToken);
        if (newRole === "admin") localStorage.setItem("adminToken", newToken);
        if (newRole === "recruiter") localStorage.setItem("recruiterToken", newToken);
        if (newRole === "company") localStorage.setItem("companyToken", newToken);
    };

    const logout = () => {
        setToken("");
        setRole("");
        setUser(null);

        // Clear all keys
        localStorage.removeItem("authToken");
        localStorage.removeItem("authRole");
        localStorage.removeItem("userToken");
        localStorage.removeItem("adminToken");
        localStorage.removeItem("recruiterToken");
        localStorage.removeItem("companyToken");
    };

    return (
        <AuthContext.Provider value={{ token, role, user, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthContext;
