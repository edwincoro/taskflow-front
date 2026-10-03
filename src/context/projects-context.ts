import { createContext } from "react";
import type { Project, RecordInput } from "../types/domain";

export interface ProjectsContextValue {
  projects: Project[];
  loading: boolean;
  error: string;
  refresh: () => Promise<void>;
  save: (input: RecordInput, id?: string) => Promise<void>;
  remove: (id: string) => Promise<void>;
}

export const ProjectsContext = createContext<ProjectsContextValue | null>(null);
