import { useCallback, useEffect, useState } from "react";
import {
  Activity,
  CircleUserRound,
  LogOut,
  RefreshCw,
  ShieldCheck,
  Wifi,
} from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "../hooks/useAuth";
import { API_URL } from "../lib/constants";
import { getErrorMessage } from "../lib/errors";
import { apiRequest } from "../services/api";
import { getCurrentUser } from "../services/auth.service";
import type { User } from "../types/domain";

interface HealthResponse {
  success?: boolean;
  message?: string;
  data?: { status?: string; environment?: string; uptime?: number };
}

export function SettingsPage() {
  const { token, user, signOut } = useAuth();
  const [profile, setProfile] = useState<User | null>(user);
  const [profileLoading, setProfileLoading] = useState(false);
  const [health, setHealth] = useState<HealthResponse["data"] | null>(null);
  const [healthLoading, setHealthLoading] = useState(false);
  const [error, setError] = useState("");

  const refreshProfile = useCallback(async () => {
    if (!token) return;
    setProfileLoading(true);
    setError("");
    try {
      setProfile(await getCurrentUser(token));
      toast.success("Perfil actualizado");
    } catch (issue) {
      setError(getErrorMessage(issue));
      toast.error("No se pudo actualizar el perfil", {
        description: getErrorMessage(issue),
      });
    } finally {
      setProfileLoading(false);
    }
  }, [token]);

  const checkHealth = useCallback(async () => {
    setHealthLoading(true);
    setError("");
    try {
      const result = await apiRequest<HealthResponse>("/status");
      setHealth(result.data || null);
      toast.success("Conexión con la API activa");
    } catch (issue) {
      setHealth(null);
      setError(getErrorMessage(issue));
      toast.error("No se pudo conectar con la API", {
        description: getErrorMessage(issue),
      });
    } finally {
      setHealthLoading(false);
    }
  }, []);

  useEffect(() => {
    if (token) {
      void getCurrentUser(token)
        .then(setProfile)
        .catch((issue: unknown) => setError(getErrorMessage(issue)));
    }
  }, [token]);

  return (
    <div className="page-content settings-page">
      <section className="page-heading">
        <div>
          <span className="eyebrow">PREFERENCIAS Y CUENTA</span>
          <h1>Ajustes</h1>
          <p>Administra tu sesión y revisa el estado de la conexión.</p>
        </div>
      </section>

      {error && (
        <div className="error-banner" role="alert">
          {error}
        </div>
      )}

      <section className="settings-grid">
        <article className="panel settings-panel">
          <header className="settings-panel-heading">
            <span className="settings-panel-icon account">
              <CircleUserRound size={19} />
            </span>
            <div>
              <span className="eyebrow">CUENTA</span>
              <h2>Perfil de usuario</h2>
            </div>
            <button
              className="icon-button quiet settings-refresh"
              title="Actualizar perfil"
              onClick={() => void refreshProfile()}
              disabled={profileLoading}
            >
              <RefreshCw
                size={16}
                className={profileLoading ? "spin-icon" : ""}
              />
            </button>
          </header>
          <dl className="settings-details">
            <div>
              <dt>Nombre</dt>
              <dd>{profile?.name || "No disponible"}</dd>
            </div>
            <div>
              <dt>Correo electrónico</dt>
              <dd>{profile?.email || "No disponible"}</dd>
            </div>
            <div>
              <dt>Identificador</dt>
              <dd>{profile?.id || "No disponible"}</dd>
            </div>
          </dl>
          <div className="settings-note">
            <ShieldCheck size={16} />
            <span>
              La sesión está protegida con un token JWT almacenado en este
              navegador.
            </span>
          </div>
        </article>

        <article className="panel settings-panel">
          <header className="settings-panel-heading">
            <span className="settings-panel-icon connection">
              <Wifi size={19} />
            </span>
            <div>
              <span className="eyebrow">SERVICIO</span>
              <h2>Conexión con la API</h2>
            </div>
          </header>
          <dl className="settings-details">
            <div>
              <dt>URL base</dt>
              <dd>
                <code>{API_URL}</code>
              </dd>
            </div>
            <div>
              <dt>Estado</dt>
              <dd className="connection-state">
                {health ? (
                  <>
                    <i className="status-dot online" />
                    {health.status || "Conectada"}
                  </>
                ) : (
                  <>
                    <i className="status-dot" />
                    Sin comprobar
                  </>
                )}
              </dd>
            </div>
            {health?.environment && (
              <div>
                <dt>Entorno</dt>
                <dd>{health.environment}</dd>
              </div>
            )}
          </dl>
          <button
            className="button secondary"
            onClick={() => void checkHealth()}
            disabled={healthLoading}
          >
            <Activity size={16} />
            {healthLoading ? "Comprobando…" : "Probar conexión"}
          </button>
        </article>

        <article className="panel settings-panel session-panel">
          <header className="settings-panel-heading">
            <span className="settings-panel-icon session">
              <LogOut size={18} />
            </span>
            <div>
              <span className="eyebrow">SEGURIDAD</span>
              <h2>Sesión actual</h2>
            </div>
          </header>
          <p className="settings-description">
            Cerrar sesión elimina el token de este navegador y te devuelve al
            acceso.
          </p>
          <button className="button danger-button" onClick={signOut}>
            <LogOut size={16} /> Cerrar sesión
          </button>
        </article>
      </section>
    </div>
  );
}
