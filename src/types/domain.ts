export interface User {
  id?: string;
  name?: string;
  email: string;
}

export interface ApiProject {
  id?: string;
  proyectoId?: string;
  _id?: string;
  nombre?: string;
  name?: string;
  titulo?: string;
  title?: string;
  descripcion?: string | null;
  description?: string | null;
  updatedAt?: string;
  actualizado_en?: string;
}

export interface ApiTask {
  id?: string;
  tareaId?: string;
  _id?: string;
  projectId?: string;
  proyectoId?: string;
  proyecto_id?: string;
  titulo?: string;
  title?: string;
  descripcion?: string | null;
  description?: string | null;
  completado?: boolean;
  completed?: boolean;
  updatedAt?: string;
  actualizado_en?: string;
}

export interface Project {
  id: string;
  name: string;
  title?: string;
  description?: string | null;
  updatedAt?: string;
}

export interface Task {
  id: string;
  projectId: string;
  title: string;
  description?: string | null;
  completed: boolean;
  updatedAt?: string;
}

export interface RecordInput {
  name?: string;
  title?: string;
  description: string;
  projectId?: string;
}

export type AuthMode = "login" | "register";

export interface AuthCredentials {
  name?: string;
  email: string;
  password: string;
}
