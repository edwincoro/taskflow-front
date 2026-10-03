import { API_URL } from "../lib/constants";
import type { RequestOptions } from "../types/api";

export class ApiError extends Error {
  constructor(
    message: string,
    public readonly status: number,
  ) {
    super(message);
    this.name = "ApiError";
  }
}

export async function apiRequest<T>(
  path: string,
  options: RequestOptions = {},
): Promise<T> {
  const { token, method = "GET", body } = options;
  const response = await fetch(`${API_URL}${path}`, {
    method,
    headers: {
      ...(body ? { "Content-Type": "application/json" } : {}),
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    ...(body ? { body: JSON.stringify(body) } : {}),
  });
  const payload: unknown =
    response.status === 204 ? null : await response.json().catch(() => null);

  if (!response.ok) {
    const message =
      typeof payload === "object" && payload !== null && "message" in payload
        ? String(payload.message)
        : typeof payload === "object" && payload !== null && "error" in payload
          ? String(payload.error)
          : `Error ${response.status}: ${response.statusText}`;
    throw new ApiError(message, response.status);
  }

  return payload as T;
}

export function unwrapRecords<T>(payload: unknown): T[] {
  if (Array.isArray(payload)) return payload as T[];
  if (typeof payload !== "object" || payload === null) return [];
  const response = payload as {
    data?: unknown;
    items?: unknown;
    proyectos?: unknown;
    tareas?: unknown;
    results?: unknown;
    rows?: unknown;
  };
  for (const collection of [
    response.items,
    response.proyectos,
    response.tareas,
    response.results,
    response.rows,
    response.data,
  ]) {
    if (Array.isArray(collection)) return collection as T[];
    if (typeof collection === "object" && collection !== null) {
      const nested = collection as {
        items?: unknown;
        rows?: unknown;
        results?: unknown;
        proyectos?: unknown;
        tareas?: unknown;
      };
      for (const records of [
        nested.items,
        nested.rows,
        nested.results,
        nested.proyectos,
        nested.tareas,
      ]) {
        if (Array.isArray(records)) return records as T[];
      }
    }
  }
  return [];
}
