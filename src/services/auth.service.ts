import { apiRequest } from "./api";
import type { AuthResponse } from "../types/api";
import type { AuthCredentials, AuthMode, User } from "../types/domain";

export interface AuthResult {
  token: string;
  user: User;
}

export async function getCurrentUser(token: string): Promise<User> {
  const response = await apiRequest<AuthResponse>("/auth/me", { token });
  return getUser(response, { email: "" });
}

function authPayload(credentials: AuthCredentials, includeName: boolean) {
  return {
    ...(includeName ? { nombre: credentials.name } : {}),
    correo: credentials.email,
    contraseña: credentials.password,
  };
}

function getToken(response: AuthResponse): string | undefined {
  return (
    response?.token ||
    response?.accessToken ||
    response?.access_token ||
    response?.jwt ||
    response?.data?.token ||
    response?.data?.accessToken ||
    response?.data?.access_token ||
    response?.data?.jwt
  );
}

function getUser(
  response: AuthResponse,
  credentials: Pick<AuthCredentials, "email"> &
    Partial<Pick<AuthCredentials, "name">>,
): User {
  const candidate =
    response?.user ||
    response?.data?.user ||
    response?.usuario ||
    response?.data?.usuario ||
    (response?.data?.usuarioId || response?.data?.correo
      ? response.data
      : undefined);
  if (!candidate) {
    return {
      name: credentials.name || credentials.email,
      email: credentials.email,
    };
  }

  const spanishUser = candidate as User & {
    usuarioId?: string;
    nombre?: string;
    correo?: string;
  };
  return {
    id: spanishUser.id || spanishUser.usuarioId,
    name:
      spanishUser.name ||
      spanishUser.nombre ||
      credentials.name ||
      credentials.email,
    email: spanishUser.email || spanishUser.correo || credentials.email,
  };
}

export async function authenticate(
  mode: AuthMode,
  credentials: AuthCredentials,
): Promise<AuthResult> {
  let response = await apiRequest<AuthResponse>(`/auth/${mode}`, {
    method: "POST",
    body: authPayload(credentials, mode === "register"),
  });

  if (mode === "register" && !getToken(response)) {
    response = await apiRequest<AuthResponse>("/auth/login", {
      method: "POST",
      body: authPayload(credentials, false),
    });
  }

  const token = getToken(response);
  if (!token) throw new Error("La API respondió sin un token JWT.");

  return {
    token,
    user: getUser(response, credentials),
  };
}
