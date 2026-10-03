import { useState, type FormEvent } from "react";
import {
  ArrowUpRight,
  Check,
  CheckCheck,
  CircleHelp,
  Sparkles,
} from "lucide-react";
import { Link, Navigate } from "react-router-dom";
import { toast } from "sonner";
import { API_URL } from "../../lib/constants";
import { getErrorMessage } from "../../lib/errors";
import { useAuth } from "../../hooks/useAuth";
import type { AuthCredentials, AuthMode } from "../../types/domain";

interface AuthPageProps {
  mode: AuthMode;
}

export function AuthPage({ mode }: AuthPageProps) {
  const { token, authenticate } = useAuth();
  const [credentials, setCredentials] = useState<AuthCredentials>({
    name: "",
    email: "",
    password: "",
  });
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const register = mode === "register";

  if (token) return <Navigate to="/dashboard" replace />;

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true);
    setError("");
    try {
      await authenticate(mode, credentials);
      toast.success(register ? "Cuenta creada" : "Sesión iniciada", {
        description: register
          ? "Tu espacio de trabajo está listo."
          : "Bienvenido de nuevo a Taskflow.",
      });
    } catch (issue) {
      setError(getErrorMessage(issue));
    } finally {
      setBusy(false);
    }
  }

  return (
    <main className="auth-layout">
      <aside className="auth-aside">
        <Link className="brand" to="/login">
          <span className="brand-mark">
            <CheckCheck size={19} />
          </span>{" "}
          taskflow<span className="brand-dot">.</span>
        </Link>
        <div className="auth-manifesto">
          <span className="eyebrow">
            <Sparkles size={14} /> ORGANIZA EL TRABAJO
          </span>
          <h1>Las buenas ideas merecen un plan.</h1>
          <p>
            Un espacio tranquilo para ordenar proyectos, avanzar tareas y ver lo
            que sigue.
          </p>
          <div className="manifesto-art" aria-hidden="true">
            <div className="orbit orbit-one" />
            <div className="orbit orbit-two" />
            <div className="orbit-core">
              <Check size={28} />
            </div>
            <span className="art-label label-a">ENFOQUE</span>
            <span className="art-label label-b">PROGRESO</span>
          </div>
        </div>
        <span className="aside-foot">TU TRABAJO, EN BUEN CAMINO</span>
      </aside>
      <section className="auth-main">
        <div className="auth-top">
          <span>¿Necesitas ayuda?</span>
          <button className="icon-button quiet" title="Ayuda">
            <CircleHelp size={19} />
          </button>
        </div>
        <div className="auth-form-wrap">
          <span className="eyebrow">BIENVENIDO A TASKFLOW</span>
          <h2>
            {register
              ? "Empieza con una cuenta nueva."
              : "Qué bueno tenerte de vuelta."}
          </h2>
          <p className="muted">
            {register
              ? "Regístrate para organizar tu trabajo."
              : "Ingresa tus datos para continuar."}
          </p>
          <div className="auth-tabs" role="tablist">
            <Link
              role="tab"
              aria-selected={!register}
              className={!register ? "selected" : ""}
              to="/login"
            >
              Iniciar sesión
            </Link>
            <Link
              role="tab"
              aria-selected={register}
              className={register ? "selected" : ""}
              to="/register"
            >
              Crear cuenta
            </Link>
          </div>
          <form className="form-stack" onSubmit={submit}>
            {register && (
              <label>
                Nombre
                <input
                  required
                  autoComplete="name"
                  value={credentials.name}
                  onChange={(event) =>
                    setCredentials({ ...credentials, name: event.target.value })
                  }
                  placeholder="Tu nombre"
                />
              </label>
            )}
            <label>
              Correo electrónico
              <input
                type="email"
                required
                autoComplete="email"
                value={credentials.email}
                onChange={(event) =>
                  setCredentials({ ...credentials, email: event.target.value })
                }
                placeholder="nombre@correo.com"
              />
            </label>
            <label>
              Contraseña
              <input
                type="password"
                required
                minLength={6}
                autoComplete={register ? "new-password" : "current-password"}
                value={credentials.password}
                onChange={(event) =>
                  setCredentials({
                    ...credentials,
                    password: event.target.value,
                  })
                }
                placeholder="Al menos 6 caracteres"
              />
            </label>
            {error && (
              <p className="alert-error" role="alert">
                {error}
              </p>
            )}
            <button className="button primary full" disabled={busy}>
              {busy
                ? "Conectando…"
                : register
                  ? "Crear cuenta"
                  : "Iniciar sesión"}{" "}
              <ArrowUpRight size={17} />
            </button>
          </form>
          <p className="auth-note">
            Conectando con <code>{API_URL}</code>
          </p>
        </div>
        <span className="auth-copyright">TASKFLOW · GESTIÓN DE PROYECTOS</span>
      </section>
    </main>
  );
}
