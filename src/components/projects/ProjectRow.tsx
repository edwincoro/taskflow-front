import { Settings2, Trash2 } from "lucide-react";
import { Link } from "react-router-dom";
import type { Project } from "../../types/domain";

interface ProjectRowProps {
  project: Project;
  index: number;
  onEdit: () => void;
  onDelete: () => void;
}

export function ProjectRow({
  project,
  index,
  onEdit,
  onDelete,
}: ProjectRowProps) {
  const colors = ["coral", "green", "yellow", "blue"];
  const name = project.name || project.title || "Proyecto";
  const initials = name
    .split(" ")
    .slice(0, 2)
    .map((part) => part.charAt(0))
    .join("")
    .toUpperCase();
  return (
    <article className="project-row">
      <span className={`project-emblem ${colors[index % colors.length]}`}>
        {initials}
      </span>
      <div className="project-row-main">
        <Link
          className="project-title-link"
          to={`/projects/${encodeURIComponent(project.id)}`}
        >
          <strong>{name}</strong>
        </Link>
        <small>{project.description || "Sin descripción"}</small>
      </div>
      <span className="project-status">
        <i /> En curso
      </span>
      <span className="project-date">
        {project.updatedAt
          ? new Date(project.updatedAt).toLocaleDateString("es")
          : "Reciente"}
      </span>
      <div className="row-actions">
        <button
          className="icon-button quiet"
          title="Editar proyecto"
          onClick={onEdit}
        >
          <Settings2 size={16} />
        </button>
        <button
          className="icon-button quiet danger-hover"
          title="Eliminar proyecto"
          onClick={onDelete}
        >
          <Trash2 size={16} />
        </button>
      </div>
    </article>
  );
}
