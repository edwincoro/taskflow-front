export const API_URL = (
  import.meta.env.VITE_API_URL || "http://localhost:3000"
).replace(/\/$/, "");
export const STORAGE_KEYS = {
  token: "taskflow-token",
  user: "taskflow-user",
} as const;

export const TODAY_LABEL = new Intl.DateTimeFormat("es-BO", {
  weekday: "long",
  day: "2-digit",
  month: "long",
})
  .format(new Date())
  .toLocaleUpperCase("es-BO");
