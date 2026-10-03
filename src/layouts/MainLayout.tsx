import { useState } from "react";
import {
  Activity,
  CheckCheck,
  ChevronDown,
  FolderKanban,
  LayoutDashboard,
  ListTodo,
  LogOut,
  Menu,
  Settings2,
} from "lucide-react";
import { NavLink, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { useProjects } from "../hooks/useProjects";

export function MainLayout() {
  const { user, signOut } = useAuth();
  const { projects } = useProjects();
  const [mobileNav, setMobileNav] = useState(false);
  const location = useLocation();
  const greeting = user?.name || user?.email?.split("@")[0] || "equipo";
  const section = location.pathname.startsWith("/projects")
    ? "Proyectos"
    : location.pathname.startsWith("/tasks")
      ? "Tareas"
      : location.pathname.startsWith("/settings")
        ? "Ajustes"
        : "Resumen";

  return (
    <div className="app-shell">
      <aside className={`sidebar ${mobileNav ? "mobile-open" : ""}`}>
        <NavLink className="brand" to="/dashboard">
          <span className="brand-mark">
            <CheckCheck size={18} />
          </span>{" "}
          taskflow<span className="brand-dot">.</span>
        </NavLink>
        <div className="workspace-switch">
          <span className="workspace-avatar">
            {greeting.charAt(0).toUpperCase()}
          </span>
          <span>
            <strong>Espacio - {greeting} </strong>
            <small>Plan personal</small>
          </span>
          <ChevronDown size={15} />
        </div>
        <nav>
          <span className="nav-label">ESPACIO DE TRABAJO</span>
          <NavLink
            end
            className={({ isActive }) => `nav-item ${isActive ? "active" : ""}`}
            to="/dashboard"
            onClick={() => setMobileNav(false)}
          >
            <LayoutDashboard size={18} /> Resumen
          </NavLink>
          <NavLink
            className={({ isActive }) => `nav-item ${isActive ? "active" : ""}`}
            to="/projects"
            onClick={() => setMobileNav(false)}
          >
            <FolderKanban size={18} /> Proyectos{" "}
            <span className="nav-count">{projects.length}</span>
          </NavLink>
          <NavLink
            className={({ isActive }) => `nav-item ${isActive ? "active" : ""}`}
            to="/tasks"
            onClick={() => setMobileNav(false)}
          >
            <ListTodo size={18} /> Tareas
          </NavLink>
          <div className="sidebar-spacer" />
          <div className="sidebar-projects">
            <span className="nav-label">TUS PROYECTOS</span>
            {projects.slice(0, 4).map((project, index) => (
              <NavLink key={project.id} className="project-nav" to="/projects">
                <i className={`project-dot dot-${index % 4}`} />
                {project.name || project.title || "Proyecto"}
              </NavLink>
            ))}
            {!projects.length && (
              <span className="empty-side">Aún no hay proyectos</span>
            )}
          </div>
          <NavLink
            className={({ isActive }) =>
              `nav-item settings-item ${isActive ? "active" : ""}`
            }
            to="/settings"
            onClick={() => setMobileNav(false)}
          >
            <Settings2 size={18} /> Ajustes
          </NavLink>
        </nav>
        <div className="sidebar-profile">
          <span className="profile-avatar">
            {greeting.charAt(0).toUpperCase()}
          </span>
          <span className="profile-copy">
            <strong>{greeting}</strong>
            <small>{user?.email || "Cuenta activa"}</small>
          </span>
          <button
            className="icon-button quiet"
            title="Cerrar sesión"
            onClick={signOut}
          >
            <LogOut size={17} />
          </button>
        </div>
      </aside>
      {mobileNav && (
        <button
          className="mobile-backdrop"
          aria-label="Cerrar navegación"
          onClick={() => setMobileNav(false)}
        />
      )}
      <main className="main-area">
        <header className="topbar">
          <button
            className="icon-button mobile-menu"
            title="Abrir menú"
            onClick={() => setMobileNav(true)}
          >
            <Menu size={20} />
          </button>
          <div className="breadcrumb">
            Workspace <span>/</span> <strong>{section}</strong>
          </div>
          <div className="topbar-actions">
            <span className="api-status">
              <i /> API conectada
            </span>
            <span className="top-avatar">
              {greeting.charAt(0).toUpperCase()}
            </span>
          </div>
        </header>
        <Outlet context={{ greeting }} />
        <footer className="page-footer">
          <span>Taskflow Workspace</span>
          <span>
            Diseñado para avanzar con claridad <Activity size={13} />
          </span>
        </footer>
      </main>
    </div>
  );
}
