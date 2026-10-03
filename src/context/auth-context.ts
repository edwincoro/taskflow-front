import { createContext } from "react";
import type { AuthCredentials, AuthMode, User } from "../types/domain";

export interface AuthContextValue {
  token: string | null;
  user: User | null;
  authenticate: (mode: AuthMode, credentials: AuthCredentials) => Promise<void>;
  signOut: () => void;
}

export const AuthContext = createContext<AuthContextValue | null>(null);
