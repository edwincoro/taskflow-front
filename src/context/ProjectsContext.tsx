import {
  useCallback,
  useEffect,
  useMemo,
  useState,
  type PropsWithChildren,
} from "react";
import { useAuth } from "../hooks/useAuth";
import { getErrorMessage } from "../lib/errors";
import {
  deleteProject,
  listProjects,
  saveProject,
} from "../services/project.service";
import type { Project, RecordInput } from "../types/domain";
import { ProjectsContext } from "./projects-context";

export function ProjectsProvider({ children }: PropsWithChildren) {
  const { token } = useAuth();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const refresh = useCallback(async () => {
    if (!token) return;
    setLoading(true);
    setError("");
    try {
      setProjects(await listProjects(token));
    } catch (issue) {
      setError(getErrorMessage(issue));
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    void Promise.resolve().then(refresh);
  }, [refresh]);

  const save = useCallback(
    async (input: RecordInput, id?: string) => {
      if (!token) return;
      await saveProject(token, input, id);
      await refresh();
    },
    [token, refresh],
  );

  const remove = useCallback(
    async (id: string) => {
      if (!token) return;
      await deleteProject(token, id);
      await refresh();
    },
    [token, refresh],
  );

  const value = useMemo(
    () => ({ projects, loading, error, refresh, save, remove }),
    [projects, loading, error, refresh, save, remove],
  );
  return (
    <ProjectsContext.Provider value={value}>
      {children}
    </ProjectsContext.Provider>
  );
}
