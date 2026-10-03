import { apiRequest, unwrapRecords } from "./api";
import type { ApiTask, RecordInput, Task } from "../types/domain";

function normalizeTask(task: ApiTask, projectId: string): Task {
  const id = task.tareaId || task.id || task._id;
  if (!id) throw new Error("La API devolvió una tarea sin identificador.");
  return {
    id,
    projectId:
      task.projectId || task.proyectoId || task.proyecto_id || projectId,
    title: task.titulo || task.title || "Tarea sin título",
    description: task.descripcion ?? task.description,
    completed: task.completado ?? task.completed ?? false,
    updatedAt: task.updatedAt || task.actualizado_en,
  };
}

export async function listTasks(
  token: string,
  projectId: string,
): Promise<Task[]> {
  const payload = await apiRequest(`/tasks/${encodeURIComponent(projectId)}`, {
    token,
  });
  return unwrapRecords<ApiTask>(payload).map((task) =>
    normalizeTask(task, projectId),
  );
}

export function saveTask(
  token: string,
  input: RecordInput,
  id?: string,
  existingProjectId?: string,
): Promise<unknown> {
  const projectId = id ? existingProjectId : input.projectId;
  if (!projectId)
    throw new Error("Selecciona un proyecto para guardar la tarea.");
  return apiRequest(
    id
      ? `/tasks/${encodeURIComponent(projectId)}/${encodeURIComponent(id)}`
      : `/tasks/${encodeURIComponent(projectId)}`,
    {
      token,
      method: id ? "PUT" : "POST",
      body: {
        titulo: input.title,
        descripcion: input.description,
      },
    },
  );
}

export function deleteTask(token: string, task: Task): Promise<unknown> {
  return apiRequest(
    `/tasks/${encodeURIComponent(task.projectId)}/${encodeURIComponent(task.id)}`,
    { token, method: "DELETE" },
  );
}

export function completeTask(token: string, task: Task): Promise<unknown> {
  const taskPath = `/tasks/${encodeURIComponent(task.projectId)}/${encodeURIComponent(task.id)}`;
  if (!task.completed)
    return apiRequest(`${taskPath}/complete`, { token, method: "PATCH" });
  return apiRequest(taskPath, {
    token,
    method: "PUT",
    body: { completado: false },
  });
}
