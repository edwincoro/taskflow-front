import { useCallback, useEffect, useState } from "react";
import { useAuth } from "./useAuth";
import { getErrorMessage } from "../lib/errors";
import {
  completeTask,
  deleteTask,
  listTasks,
  saveTask,
} from "../services/task.service";
import { useProjects } from "./useProjects";
import type { RecordInput, Task } from "../types/domain";

export function useTasks(projectId?: string) {
  const { token } = useAuth();
  const { projects } = useProjects();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const refresh = useCallback(async () => {
    if (!token) return;
    setLoading(true);
    setError("");
    try {
      if (projectId) {
        setTasks(await listTasks(token, projectId));
        return;
      }
      const results = await Promise.allSettled(
        projects.map((project) => listTasks(token, project.id)),
      );
      const failures = results.filter((result) => result.status === "rejected");
      if (failures.length) throw failures[0].reason;
      setTasks(
        results.flatMap((result) =>
          result.status === "fulfilled" ? result.value : [],
        ),
      );
    } catch (issue) {
      setError(getErrorMessage(issue));
    } finally {
      setLoading(false);
    }
  }, [token, projects, projectId]);

  useEffect(() => {
    void Promise.resolve().then(refresh);
  }, [refresh]);

  const save = useCallback(
    async (input: RecordInput, id?: string, existingProjectId?: string) => {
      if (!token) return;
      await saveTask(token, input, id, existingProjectId);
      await refresh();
    },
    [token, refresh],
  );

  const remove = useCallback(
    async (id: string) => {
      if (!token) return;
      const task = tasks.find((item) => item.id === id);
      if (!task)
        throw new Error("No se encontró el proyecto asociado a la tarea.");
      await deleteTask(token, task);
      await refresh();
    },
    [token, tasks, refresh],
  );

  const toggle = useCallback(
    async (task: Task) => {
      if (!token) return;
      await completeTask(token, task);
      await refresh();
    },
    [token, refresh],
  );

  return { tasks, loading, error, refresh, save, remove, toggle };
}
