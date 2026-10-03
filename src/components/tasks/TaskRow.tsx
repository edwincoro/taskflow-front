import { Check, Settings2, Trash2 } from "lucide-react";
import type { Task } from "../../types/domain";

interface TaskRowProps {
  task: Task;
  onToggle: () => void;
  onEdit: () => void;
  onDelete: () => void;
}

export function TaskRow({ task, onToggle, onEdit, onDelete }: TaskRowProps) {
  return (
    <article className={`task-row ${task.completed ? "is-done" : ""}`}>
      <button
        className={`task-check ${task.completed ? "checked" : ""}`}
        aria-label={task.completed ? "Marcar pendiente" : "Marcar completada"}
        onClick={onToggle}
      >
        {task.completed && <Check size={13} />}
      </button>
      <div className="task-row-main">
        <strong>{task.title || "Tarea sin título"}</strong>
        <small>{task.description || "Sin descripción"}</small>
      </div>
      <span className={`task-priority ${task.completed ? "done-tag" : ""}`}>
        {task.completed ? "Completada" : "Pendiente"}
      </span>
      <span className="task-date">
        {task.updatedAt
          ? new Date(task.updatedAt).toLocaleDateString("es")
          : "Hoy"}
      </span>
      <div className="row-actions">
        <button
          className="icon-button quiet"
          title="Editar tarea"
          onClick={onEdit}
        >
          <Settings2 size={16} />
        </button>
        <button
          className="icon-button quiet danger-hover"
          title="Eliminar tarea"
          onClick={onDelete}
        >
          <Trash2 size={16} />
        </button>
      </div>
    </article>
  );
}
