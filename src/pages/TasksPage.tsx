import { useState } from "react";
import { Plus } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";
import { EmptyState } from "../components/common/EmptyState";
import { Loading } from "../components/common/Loading";
import { SearchField } from "../components/common/SearchField";
import { RecordModal } from "../components/ui/RecordModal";
import { TaskRow } from "../components/tasks/TaskRow";
import { useTasks } from "../hooks/useTasks";
import { useProjects } from "../hooks/useProjects";
import { getErrorMessage } from "../lib/errors";
import type { RecordInput, Task } from "../types/domain";

export function TasksPage() {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const {
    tasks,
    loading,
    error: tasksError,
    save,
    remove,
    toggle,
  } = useTasks(projectId);
  const {
    projects,
    loading: projectsLoading,
    error: projectsError,
  } = useProjects();
  const selectedProject = projects.find((project) => project.id === projectId);
  const [query, setQuery] = useState("");
  const [modal, setModal] = useState<Task | null | undefined>(undefined);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const loadError = tasksError || projectsError;
  const projectName =
    selectedProject?.name || selectedProject?.title || "Proyecto";
  const visible = tasks.filter((task) =>
    `${task.title || ""} ${task.description || ""}`
      .toLowerCase()
      .includes(query.toLowerCase()),
  );

  async function submit(
    input: RecordInput,
    id?: string,
    existingProjectId?: string,
  ) {
    setSaving(true);
    try {
      await save(input, id, existingProjectId);
      setModal(undefined);
      toast.success(id ? "Tarea actualizada" : "Tarea creada");
    } catch (issue) {
      setError(getErrorMessage(issue));
      throw issue;
    } finally {
      setSaving(false);
    }
  }

  async function deleteRecord(task: Task) {
    if (!window.confirm(`¿Eliminar la tarea "${task.title}"?`)) return;
    try {
      await remove(task.id);
      toast.success("Tarea eliminada");
    } catch (issue) {
      setError(getErrorMessage(issue));
    }
  }

  async function toggleRecord(task: Task) {
    try {
      await toggle(task);
      toast.success(
        task.completed ? "Tarea marcada como pendiente" : "Tarea completada",
      );
    } catch (issue) {
      setError(getErrorMessage(issue));
    }
  }

  if (projectId && !projectsLoading && !projectsError && !selectedProject) {
    return (
      <div className="page-content">
        <EmptyState
          text="No encontramos este proyecto"
          action="Volver a proyectos"
          onClick={() => navigate("/projects")}
        />
      </div>
    );
  }

  return (
    <div className="page-content">
      <section className="page-heading">
        <div>
          <span className="eyebrow">
            {projectId ? "TAREAS DEL PROYECTO" : "BANDEJA PERSONAL"}
          </span>
          <h1>{projectId ? projectName : "Tareas"}</h1>
          <p>
            {projectId
              ? selectedProject?.description || "Tareas de este proyecto."
              : "Pequeños avances hacen grandes proyectos."}
          </p>
        </div>
        <button className="button primary" onClick={() => setModal(null)}>
          <Plus size={17} /> Nueva tarea
        </button>
      </section>
      {(error || loadError) && (
        <div className="error-banner" role="alert">
          {error || loadError}
        </div>
      )}
      <section className="panel full-panel">
        <div className="panel-heading">
          <div>
            <span className="eyebrow">TAREAS</span>
            <h2>
              {projectId ? `Tareas de ${projectName}` : "Todas las tareas"}{" "}
              <span className="heading-count">{tasks.length}</span>
            </h2>
          </div>
          <SearchField value={query} onChange={setQuery} />
        </div>
        {loading ? (
          <Loading />
        ) : visible.length ? (
          <div className="task-list all-tasks">
            {visible.map((task) => (
              <TaskRow
                key={task.id}
                task={task}
                onToggle={() => void toggleRecord(task)}
                onEdit={() => setModal(task)}
                onDelete={() => void deleteRecord(task)}
              />
            ))}
          </div>
        ) : (
          <EmptyState
            text="No hay tareas para mostrar"
            action="Crear tarea"
            onClick={() => setModal(null)}
          />
        )}
      </section>
      {modal !== undefined && (
        <RecordModal
          type="task"
          record={modal || undefined}
          defaultProjectId={projectId}
          saving={saving}
          onClose={() => setModal(undefined)}
          onSubmit={submit}
        />
      )}
    </div>
  );
}
