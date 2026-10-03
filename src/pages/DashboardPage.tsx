import { useState } from "react";
import {
  Activity,
  ArrowUpRight,
  CheckCheck,
  FolderKanban,
  ListTodo,
  Plus,
} from "lucide-react";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { EmptyState } from "../components/common/EmptyState";
import { Loading } from "../components/common/Loading";
import { Metric } from "../components/dashboard/Metric";
import { ProjectRow } from "../components/projects/ProjectRow";
import { RecordModal } from "../components/ui/RecordModal";
import { TaskRow } from "../components/tasks/TaskRow";
import { getErrorMessage } from "../lib/errors";
import { TODAY_LABEL } from "../lib/constants";
import { useProjects } from "../hooks/useProjects";
import { useTasks } from "../hooks/useTasks";
import type { Project, RecordInput, Task } from "../types/domain";

export function DashboardPage() {
  const projectsApi = useProjects();
  const tasksApi = useTasks();
  const navigate = useNavigate();
  const [modal, setModal] = useState<{
    type: "project" | "task";
    record?: Project | Task;
  } | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const completed = tasksApi.tasks.filter((task) => task.completed).length;
  const pending = tasksApi.tasks.filter((task) => !task.completed);
  const loading = projectsApi.loading || tasksApi.loading;

  async function save(
    input: RecordInput,
    id?: string,
    existingProjectId?: string,
  ) {
    if (!modal) return;
    setSaving(true);
    try {
      if (modal.type === "project") await projectsApi.save(input, id);
      else await tasksApi.save(input, id, existingProjectId);
      setModal(null);
      toast.success(
        id
          ? "Cambios guardados"
          : modal.type === "project"
            ? "Proyecto creado"
            : "Tarea creada",
      );
    } catch (issue) {
      setError(getErrorMessage(issue));
      throw issue;
    } finally {
      setSaving(false);
    }
  }

  async function remove(type: "project" | "task", record: Project | Task) {
    const name = "name" in record ? record.name : record.title;
    if (!window.confirm(`¿Eliminar "${name}"?`)) return;
    try {
      if (type === "project") await projectsApi.remove(record.id);
      else await tasksApi.remove(record.id);
      toast.success(
        type === "project" ? "Proyecto eliminado" : "Tarea eliminada",
      );
    } catch (issue) {
      setError(getErrorMessage(issue));
    }
  }

  async function toggle(task: Task) {
    try {
      await tasksApi.toggle(task);
      toast.success(
        task.completed ? "Tarea marcada como pendiente" : "Tarea completada",
      );
    } catch (issue) {
      setError(getErrorMessage(issue));
    }
  }

  return (
    <div className="page-content">
      <section className="page-heading">
        <div>
          <span className="eyebrow">{TODAY_LABEL}</span>
          <h1>
            Tu espacio de trabajo<span className="heading-period">.</span>
          </h1>
          <p>Un vistazo claro a lo que estás construyendo.</p>
        </div>
        <button
          className="button primary"
          onClick={() => setModal({ type: "project" })}
        >
          <Plus size={17} /> Nuevo proyecto
        </button>
      </section>
      {(error || projectsApi.error || tasksApi.error) && (
        <div className="error-banner" role="alert">
          <span>{error || projectsApi.error || tasksApi.error}</span>
          <button
            className="icon-button"
            onClick={() => setError("")}
            title="Cerrar"
          >
            ×
          </button>
        </div>
      )}
      <section className="metric-row">
        <Metric
          label="Proyectos activos"
          value={projectsApi.projects.length}
          icon={<FolderKanban size={17} />}
          delta="En marcha"
          color="coral"
        />
        <Metric
          label="Tareas pendientes"
          value={pending.length}
          icon={<ListTodo size={17} />}
          delta={`${completed} completadas`}
          color="green"
        />
        <Metric
          label="Tareas completadas"
          value={completed}
          icon={<CheckCheck size={17} />}
          delta={
            tasksApi.tasks.length
              ? `${Math.round((completed / tasksApi.tasks.length) * 100)}% del total`
              : "Sin actividad"
          }
          color="yellow"
        />
      </section>
      <section className="overview-grid">
        <div className="panel project-panel">
          <div className="panel-heading">
            <div>
              <span className="eyebrow">VISTA GENERAL</span>
              <h2>Proyectos recientes</h2>
            </div>
            <button
              className="text-button"
              onClick={() => navigate("/projects")}
            >
              Ver todos <ArrowUpRight size={15} />
            </button>
          </div>
          {loading ? (
            <Loading />
          ) : projectsApi.projects.length ? (
            <div className="project-list">
              {projectsApi.projects.slice(0, 4).map((project, index) => (
                <ProjectRow
                  key={project.id}
                  project={project}
                  index={index}
                  onEdit={() => setModal({ type: "project", record: project })}
                  onDelete={() => void remove("project", project)}
                />
              ))}
            </div>
          ) : (
            <EmptyState
              text="Todavía no hay proyectos"
              action="Crea tu primer proyecto"
              onClick={() => setModal({ type: "project" })}
            />
          )}
        </div>
        <div className="panel task-panel">
          <div className="panel-heading">
            <div>
              <span className="eyebrow">SIGUIENTE PASO</span>
              <h2>Tareas por hacer</h2>
            </div>
            <button
              className="icon-button quiet"
              title="Nueva tarea"
              onClick={() => setModal({ type: "task" })}
            >
              <Plus size={18} />
            </button>
          </div>
          {loading ? (
            <Loading />
          ) : pending.length ? (
            <div className="task-list">
              {pending.slice(0, 5).map((task) => (
                <TaskRow
                  key={task.id}
                  task={task}
                  onToggle={() => void toggle(task)}
                  onEdit={() => setModal({ type: "task", record: task })}
                  onDelete={() => void remove("task", task)}
                />
              ))}
            </div>
          ) : (
            <EmptyState
              text="Todo está al día"
              action="Añade una tarea"
              onClick={() => setModal({ type: "task" })}
            />
          )}
        </div>
      </section>
      <section className="progress-strip">
        <div className="progress-copy">
          <span className="progress-icon">
            <Activity size={18} />
          </span>
          <div>
            <strong>Tu ritmo de hoy</strong>
            <small>
              {completed} de {tasksApi.tasks.length} tareas completadas
            </small>
          </div>
        </div>
        <div className="progress-track">
          <span
            style={{
              width: `${tasksApi.tasks.length ? (completed / tasksApi.tasks.length) * 100 : 0}%`,
            }}
          />
        </div>
        <strong className="progress-percent">
          {tasksApi.tasks.length
            ? Math.round((completed / tasksApi.tasks.length) * 100)
            : 0}
          %
        </strong>
        <ArrowUpRight className="progress-arrow" size={20} />
      </section>
      {modal && (
        <RecordModal
          type={modal.type}
          record={modal.record}
          saving={saving}
          onClose={() => setModal(null)}
          onSubmit={save}
        />
      )}
    </div>
  );
}
