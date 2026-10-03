import { useCallback, useMemo, useState, type PropsWithChildren } from "react";
import { authenticate as authenticateService } from "../services/auth.service";
import { STORAGE_KEYS } from "../lib/constants";
import type { User } from "../types/domain";
import { AuthContext } from "./auth-context";

function readStoredUser(): User | null {
  try {
    const value = localStorage.getItem(STORAGE_KEYS.user);
    return value ? (JSON.parse(value) as User) : null;
  } catch {
    localStorage.removeItem(STORAGE_KEYS.user);
    return null;
  }
}

export function AuthProvider({ children }: PropsWithChildren) {
  const [token, setToken] = useState<string | null>(() =>
    localStorage.getItem(STORAGE_KEYS.token),
  );
  const [user, setUser] = useState<User | null>(readStoredUser);

  const authenticate = useCallback(
    async (
      mode: "login" | "register",
      credentials: { name?: string; email: string; password: string },
    ) => {
      const result = await authenticateService(mode, credentials);
      localStorage.setItem(STORAGE_KEYS.token, result.token);
      localStorage.setItem(STORAGE_KEYS.user, JSON.stringify(result.user));
      setToken(result.token);
      setUser(result.user);
    },
    [],
  );

  const signOut = useCallback(() => {
    localStorage.removeItem(STORAGE_KEYS.token);
    localStorage.removeItem(STORAGE_KEYS.user);
    setToken(null);
    setUser(null);
  }, []);

  const value = useMemo(
    () => ({ token, user, authenticate, signOut }),
    [token, user, authenticate, signOut],
  );
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
