export interface ApiEnvelope<T> {
  data?: T;
  items?: T;
  message?: string;
}

export interface AuthResponse {
  token?: string;
  accessToken?: string;
  access_token?: string;
  jwt?: string;
  user?: import("./domain").User;
  usuario?: { id?: string; nombre?: string; correo?: string };
  usuarioId?: string;
  nombre?: string;
  correo?: string;
  data?: {
    token?: string;
    accessToken?: string;
    access_token?: string;
    jwt?: string;
    user?: import("./domain").User;
    usuario?: { id?: string; nombre?: string; correo?: string };
    usuarioId?: string;
    nombre?: string;
    correo?: string;
  };
}

export interface RequestOptions {
  token?: string | null;
  method?: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
  body?: unknown;
}
