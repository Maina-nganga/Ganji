import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(() => sessionStorage.getItem("ganji_token")); // ✅ fixed
  const [loading, setLoading] = useState(true);

  const fetchUser = async (accessToken) => {
    try {
      const res = await fetch("https://ganji-f4ne.onrender.com/api/auth/me", {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if (!res.ok) {
        logout();
        return;
      }

      const data = await res.json();
      setUser(data);
    } catch (err) {
      console.error("Failed to fetch user:", err);
      logout();
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      fetchUser(token);
    } else {
      setLoading(false);
    }
  }, []);

  const login = async (accessToken) => {
    sessionStorage.setItem("ganji_token", accessToken);
    setToken(accessToken);
    await fetchUser(accessToken);
  };

  const logout = () => {
    sessionStorage.removeItem("ganji_token");
    setToken(null);
    setUser(null);
    setLoading(false);
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}