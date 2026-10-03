import { useState } from "react";
import { Plus } from "lucide-react";
import { toast } from "sonner";
import { EmptyState } from "../components/common/EmptyState";
import { Loading } from "../components/common/Loading";
import { SearchField } from "../components/common/SearchField";
import { ProjectRow } from "../components/projects/ProjectRow";
import { RecordModal } from "../components/ui/RecordModal";
import { useProjects } from "../hooks/useProjects";
import { getErrorMessage } from "../lib/errors";
import type { Project, RecordInput } from "../types/domain";

export function ProjectsPage() {
  const { projects, loading, error: loadError, save, remove } = useProjects();
  const [query, setQuery] = useState("");
  const [modal, setModal] = useState<Project | null | undefined>(undefined);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const visible = projects.filter((project) =>
    `${project.name || project.title || ""} ${project.description || ""}`
      .toLowerCase()
      .includes(query.toLowerCase()),
  );

  async function submit(input: RecordInput, id?: string) {
    setSaving(true);
    try {
      await save(input, id);
      setModal(undefined);
      toast.success(id ? "Proyecto actualizado" : "Proyecto creado");
    } catch (issue) {
      setError(getErrorMessage(issue));
      throw issue;
    } finally {
      setSaving(false);
    }
  }

  async function deleteRecord(project: Project) {
    if (
      !window.confirm(
        `¿Eliminar el proyecto "${project.name || project.title}"?`,
      )
    )
      return;
    try {
      await remove(project.id);
      toast.success("Proyecto eliminado");
    } catch (issue) {
      setError(getErrorMessage(issue));
    }
  }

  return (
    <div className="page-content">
      <section className="page-heading">
        <div>
          <span className="eyebrow">PORTAFOLIO</span>
          <h1>Proyectos</h1>
          <p>Cada objetivo empieza con un espacio propio.</p>
        </div>
        <button className="button primary" onClick={() => setModal(null)}>
          <Plus size={17} /> Nuevo proyecto
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
            <span className="eyebrow">ESPACIOS DE TRABAJO</span>
            <h2>
              Todos los proyectos{" "}
              <span className="heading-count">{projects.length}</span>
            </h2>
          </div>
          <SearchField value={query} onChange={setQuery} />
        </div>
        {loading ? (
          <Loading />
        ) : visible.length ? (
          <div className="project-list">
            {visible.map((project, index) => (
              <ProjectRow
                key={project.id}
                project={project}
                index={index}
                onEdit={() => setModal(project)}
                onDelete={() => void deleteRecord(project)}
              />
            ))}
          </div>
        ) : (
          <EmptyState
            text="No hay proyectos para mostrar"
            action="Crear proyecto"
            onClick={() => setModal(null)}
          />
        )}
      </section>
      {modal !== undefined && (
        <RecordModal
          type="project"
          record={modal || undefined}
          saving={saving}
          onClose={() => setModal(undefined)}
          onSubmit={submit}
        />
      )}
    </div>
  );
}
