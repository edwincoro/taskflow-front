import { apiRequest, unwrapRecords } from "./api";
import type { ApiProject, Project, RecordInput } from "../types/domain";

function normalizeProject(project: ApiProject): Project {
  const id = project.proyectoId || project.id || project._id;
  if (!id) throw new Error("La API devolvió un proyecto sin identificador.");
  return {
    id,
    name:
      project.nombre ||
      project.name ||
      project.titulo ||
      project.title ||
      "Proyecto",
    description: project.descripcion ?? project.description,
    updatedAt: project.updatedAt || project.actualizado_en,
  };
}

export async function listProjects(token: string): Promise<Project[]> {
  return unwrapRecords<ApiProject>(
    await apiRequest("/projects", { token }),
  ).map(normalizeProject);
}

export function saveProject(
  token: string,
  input: RecordInput,
  id?: string,
): Promise<unknown> {
  if (!id && input.name === undefined)
    throw new Error("El nombre del proyecto es obligatorio.");
  return apiRequest(id ? `/projects/${id}` : "/projects", {
    token,
    method: id ? "PUT" : "POST",
    body: {
      nombre: input.name,
      descripcion: input.description,
    },
  });
}

export function deleteProject(token: string, id: string): Promise<unknown> {
  if (!id)
    throw new Error(
      "No se puede eliminar el proyecto: falta su identificador.",
    );
  return apiRequest(`/projects/${id}`, { token, method: "DELETE" });
}
