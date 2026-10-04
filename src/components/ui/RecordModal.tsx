import { useState, type FormEvent } from "react";
import { ArrowUpRight, X } from "lucide-react";
import type {
  Project,
  RecordInput,
  Task,
  Project as ProjectOption,
} from "../../types/domain";
import { useProjects } from "../../hooks/useProjects";

type ResourceType = "project" | "task";

interface RecordModalProps {
  type: ResourceType;
  record?: Project | Task;
  saving: boolean;
  projects?: ProjectOption[];
  defaultProjectId?: string;
  onClose: () => void;
  onSubmit: (
    input: RecordInput,
    id?: string,
    existingProjectId?: string,
  ) => Promise<void>;
}

export function RecordModal({
  type,
  record,
  saving,
  defaultProjectId,
  onClose,
  onSubmit,
}: RecordModalProps) {
  const project = type === "project";
  const { projects } = useProjects();
  const [error, setError] = useState("");

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const values = new FormData(event.currentTarget);
    const input: RecordInput = {
      ...(project
        ? { name: String(values.get("name") || "") }
        : {
            title: String(values.get("title") || ""),
            projectId: String(
              values.get("projectId") || defaultProjectId || "",
            ),
          }),
      description: String(values.get("description") || ""),
    };
    try {
      await onSubmit(
        input,
        record?.id,
        !project ? (record as Task | undefined)?.projectId : undefined,
      );
    } catch (issue) {
      setError(
        issue instanceof Error
          ? issue.message
          : "No se pudo guardar el elemento.",
      );
    }
  }

  const title = project
    ? (record as Project | undefined)?.name ||
      (record as Project | undefined)?.title
    : (record as Task | undefined)?.title;

  return (
    <div
      className="modal-backdrop"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <section
        className="record-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
      >
        <header className="modal-heading">
          <div>
            <span className="eyebrow">
              {project ? "ORGANIZA TU TRABAJO" : "SIGUIENTE PASO"}
            </span>
            <h2 id="modal-title">
              {record ? "Editar" : "Nuevo"} {project ? "proyecto" : "tarea"}
            </h2>
          </div>
          <button
            type="button"
            className="icon-button quiet"
            title="Cerrar"
            onClick={onClose}
          >
            <X size={19} />
          </button>
        </header>
        <form className="form-stack" onSubmit={submit}>
          <label>
            {project ? "Nombre del proyecto" : "Título de la tarea"}
            <input
              name={project ? "name" : "title"}
              required
              defaultValue={title || ""}
              placeholder={
                project ? "Ej. Rediseño de marca" : "Ej. Preparar propuesta"
              }
            />
          </label>
          {!project && (
            <label>
              Proyecto
              <select
                name="projectId"
                required
                defaultValue={
                  (record as Task | undefined)?.projectId ||
                  defaultProjectId ||
                  ""
                }
                disabled={
                  projects.length === 0 ||
                  Boolean(record) ||
                  Boolean(defaultProjectId)
                }
              >
                <option value="" disabled>
                  Selecciona un proyecto
                </option>
                {projects.map((option) => (
                  <option key={option.id} value={option.id}>
                    {option.name || option.title || "Proyecto"}
                  </option>
                ))}
              </select>
              {projects.length === 0 && (
                <small className="form-hint">
                  Crea primero un proyecto para poder asociar la tarea.
                </small>
              )}
            </label>
          )}
          <label>
            Descripción
            <textarea
              name="description"
              rows={4}
              defaultValue={record?.description || ""}
              placeholder="Añade algunos detalles…"
            />
          </label>
          {error && (
            <p className="alert-error" role="alert">
              {error}
            </p>
          )}
          <div className="modal-actions">
            <button
              type="button"
              className="button secondary"
              onClick={onClose}
            >
              Cancelar
            </button>
            <button
              className="button primary"
              disabled={saving || (!project && projects.length === 0)}
            >
              {saving
                ? "Guardando…"
                : record
                  ? "Guardar cambios"
                  : `Crear ${project ? "proyecto" : "tarea"}`}{" "}
              <ArrowUpRight size={16} />
            </button>
          </div>
        </form>
      </section>
    </div>
  );
}
