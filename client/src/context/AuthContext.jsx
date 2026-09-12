import { createContext, useContext, useEffect, useMemo, useState } from "react";
import {
  getMe,
  loginUser,
  logoutUser,
  registerUser,
} from "../services/authApi";

const C = createContext(null);

const getToken = () =>
  localStorage.getItem("mindguard_token") ||
  sessionStorage.getItem("mindguard_token");

const getStoredUser = () => {
  try {
    return JSON.parse(
      localStorage.getItem("mindguard_user") ||
        sessionStorage.getItem("mindguard_user") ||
        "null"
    );
  } catch {
    return null;
  }
};

export function AuthProvider({ children }) {
  const [t, setT] = useState(getToken());
  const [user, setUser] = useState(getStoredUser());
  const [loading, setLoading] = useState(!!getToken());

  const clear = () => {
    localStorage.removeItem("mindguard_token");
    localStorage.removeItem("mindguard_user");
    sessionStorage.removeItem("mindguard_token");
    sessionStorage.removeItem("mindguard_user");

    setT(null);
    setUser(null);
  };

  useEffect(() => {
    const currentToken = getToken();

    if (!currentToken) {
      setLoading(false);
      return;
    }

    getMe()
      .then((r) => {
        setUser(r.data.data.user);
      })
      .catch(() => {
        clear();
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    const handleUnauthorized = () => {
      clear();
    };

    window.addEventListener("mindguard:unauthorized", handleUnauthorized);

    return () => {
      window.removeEventListener(
        "mindguard:unauthorized",
        handleUnauthorized
      );
    };
  }, []);

  const persist = (tk, u, remember) => {
    const storage = remember ? localStorage : sessionStorage;
    const otherStorage = remember ? sessionStorage : localStorage;

    otherStorage.removeItem("mindguard_token");
    otherStorage.removeItem("mindguard_user");

    storage.setItem("mindguard_token", tk);
    storage.setItem("mindguard_user", JSON.stringify(u));

    setT(tk);
    setUser(u);
  };

  const login = async (payload, remember = true) => {
    const response = await loginUser(payload);

    persist(
      response.data.data.token,
      response.data.data.user,
      remember
    );

    return response;
  };

  const register = async (payload, remember = true) => {
    const response = await registerUser(payload);

    persist(
      response.data.data.token,
      response.data.data.user,
      remember
    );

    return response;
  };

  const logout = async () => {
    try {
      if (t) {
        await logoutUser();
      }
    } catch {
    
    }

    clear();
  };

  const value = useMemo(
    () => ({
      token: t,
      user,
      loading,
      isAuthenticated: !!(t && user),
      login,
      register,
      logout,
      setUser,
    }),
    [t, user, loading]
  );

  return <C.Provider value={value}>{children}</C.Provider>;
}

export const useAuth = () => useContext(C);