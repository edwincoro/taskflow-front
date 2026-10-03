# Taskflow Frontend

Aplicación web SPA construida con React y TypeScript para administrar proyectos y sus tareas mediante la API TaskFlow. Incluye registro e inicio de sesión, autenticación JWT, dashboard, CRUD de proyectos y tareas, búsqueda, estados de carga y error, notificaciones y una vista de ajustes de cuenta y conexión.

## Requisitos

- Node.js 20.19+ o 22.12+.
- npm.
- Backend Taskflow iniciado y accesible desde el navegador.
- Git para clonar o publicar el proyecto.

## Instalación y ejecución

1. Instala las dependencias:

   ```bash
   npm install
   ```

2. Configura la URL de la API en `.env` en la raíz del proyecto:

   ```env
   VITE_API_URL=http://localhost:3000
   ```

   Este archivo local ya está ignorado por Git. `.env.example` sirve como referencia y puede copiarse si hace falta: `cp .env.example .env` (PowerShell: `Copy-Item .env.example .env`). Si el backend usa otro host o puerto, actualiza `VITE_API_URL`.

3. Inicia el servidor de desarrollo:

   ```bash
   npm run dev
   ```

4. Abre la dirección que muestra Vite, normalmente `http://localhost:5173`.

El backend debe permitir CORS desde el origen del frontend. Al cambiar `.env`, reinicia Vite para que lea la configuración nueva.

## Comandos disponibles

| Comando                                        | Descripción                                      |
| ---------------------------------------------- | ------------------------------------------------ |
| `npm run dev`                                  | Inicia Vite en modo desarrollo.                  |
| `npm run build`                                | Genera el bundle de producción en `dist/`.       |
| `npm run preview`                              | Sirve localmente el último bundle de producción. |
| `npm run typecheck`                            | Comprueba los tipos TypeScript en modo estricto. |
| `npm run lint`                                 | Ejecuta Oxlint sobre el proyecto.                |
| `npx prettier --check "src/**/*.{ts,tsx,css}"` | Comprueba el formato de los archivos fuente.     |
| `npx prettier --write "src/**/*.{ts,tsx,css}"` | Formatea los archivos fuente.                    |

## Funcionalidad

- **Crear cuenta e iniciar sesión:** el registro usa `nombre`, `correo` y `contraseña`. El backend crea la cuenta, pero no devuelve un JWT en esa respuesta; por eso la aplicación inicia sesión automáticamente después del registro.
- **Sesión JWT:** el token y los datos básicos del usuario se guardan en `localStorage`. Las peticiones protegidas envían `Authorization: Bearer <token>`. Las rutas privadas redirigen a `/login` si no hay sesión.
- **Dashboard (`/dashboard`):** presenta métricas, proyectos recientes, tareas pendientes y progreso de tareas.
- **Proyectos (`/projects`):** permite listar, buscar, crear, editar y eliminar proyectos.
- **Tareas (`/tasks`):** lista tareas de todos los proyectos del usuario; permite buscar, crear, editar, eliminar, completar y volver a marcar como pendiente. Cada tarea queda asociada a un proyecto.
- **Ajustes (`/settings`):** consulta el perfil autenticado, prueba el estado del backend y permite cerrar sesión.
- **Feedback de interfaz:** muestra carga, errores, estados vacíos y confirmaciones de éxito/error mediante Sonner.
- **Diseño adaptable:** navegación y formularios se ajustan a pantallas móviles y de escritorio.

## Rutas de la aplicación

| Ruta         | Acceso       | Vista                                     |
| ------------ | ------------ | ----------------------------------------- |
| `/login`     | Pública      | Inicio de sesión.                         |
| `/register`  | Pública      | Registro de usuario.                      |
| `/dashboard` | Requiere JWT | Resumen de actividad.                     |
| `/projects`  | Requiere JWT | Gestión de proyectos.                     |
| `/tasks`     | Requiere JWT | Gestión de tareas asociadas a proyectos.  |
| `/settings`  | Requiere JWT | Perfil, estado de API y cierre de sesión. |

No se implementa una landing page pública: al abrir la aplicación sin sesión, el usuario es enviado al inicio de sesión.

## API consumida

La integración se basa en el contrato publicado por el backend local en `http://localhost:3000/api-docs`. Los nombres de campos del API están en español; los servicios los convierten a los modelos internos de la interfaz.

| Método   | Ruta                             | Función                                                     |
| -------- | -------------------------------- | ----------------------------------------------------------- |
| `POST`   | `/auth/register`                 | Registra usuario con `{ nombre, correo, contraseña }`.      |
| `POST`   | `/auth/login`                    | Inicia sesión con `{ correo, contraseña }` y obtiene JWT.   |
| `GET`    | `/auth/me`                       | Obtiene el perfil del usuario autenticado.                  |
| `GET`    | `/projects`                      | Lista los proyectos del usuario autenticado.                |
| `POST`   | `/projects`                      | Crea proyecto con `{ nombre, descripcion }`.                |
| `GET`    | `/projects/:id`                  | Obtiene un proyecto.                                        |
| `PUT`    | `/projects/:id`                  | Actualiza un proyecto.                                      |
| `DELETE` | `/projects/:id`                  | Elimina un proyecto.                                        |
| `GET`    | `/tasks/:projectId`              | Lista tareas de un proyecto; admite paginación del backend. |
| `POST`   | `/tasks/:projectId`              | Crea tarea con `{ titulo, descripcion }`.                   |
| `GET`    | `/tasks/:projectId/:id`          | Obtiene una tarea de un proyecto.                           |
| `PUT`    | `/tasks/:projectId/:id`          | Actualiza título, descripción o estado de una tarea.        |
| `DELETE` | `/tasks/:projectId/:id`          | Elimina una tarea.                                          |
| `PATCH`  | `/tasks/:projectId/:id/complete` | Marca una tarea como completada.                            |
| `GET`    | `/status`                        | Comprueba el estado de la API.                              |

Las tareas están anidadas bajo su proyecto porque el backend requiere `projectId` en cada operación. El listado soporta respuestas directas y envoltorios como `{ data: [...] }`, `{ items: [...] }`, `{ proyectos: [...] }`, `{ tareas: [...] }` y estructuras paginadas `{ data: { items, pagination } }`.

## Estructura del código

```text
src/
├── assets/                 # Recursos estáticos
├── components/
│   ├── auth/               # Formularios y presentación de autenticación
│   ├── common/             # Protección de rutas, carga, búsqueda y estados vacíos
│   ├── dashboard/          # Métricas del panel
│   ├── projects/           # Componentes de proyectos
│   ├── tasks/              # Componentes de tareas
│   └── ui/                 # Formularios y elementos reutilizables
├── context/                # Estado compartido y providers
├── hooks/                  # Hooks de autenticación, proyectos y tareas
├── layouts/                # Estructura privada común
├── lib/                    # Constantes y utilidades
├── pages/                  # Login, registro, dashboard, proyectos, tareas y ajustes
├── services/               # Cliente HTTP y servicios de API por dominio
├── types/                  # Tipos de dominio y respuestas de API
├── App.tsx                 # Providers y rutas
└── main.tsx                # Entrada de React y Toaster global
```

## Conceptos de React aplicados

- Componentes funcionales y paso de datos/comportamiento mediante props.
- `useState` para formularios, modales, navegación, carga y errores.
- `useEffect` para sincronizar vistas con datos remotos.
- Context API para compartir la sesión y los proyectos entre páginas y layout.
- Hooks de dominio (`useAuth`, `useProjects`, `useTasks`) para encapsular estado y operaciones.
- Formularios, consumo de API, renderizado condicional y estados de carga/error/vacío.
- Tipos estrictos para modelos y payloads; cliente HTTP centralizado con inyección del JWT.

## Seguridad y límites conocidos

- `VITE_API_URL` es configuración pública del frontend, no un secreto. No coloques claves privadas ni credenciales en variables `VITE_*`.
- El JWT se almacena en `localStorage`; para un despliegue institucional debe evaluarse el modelo de sesión y protección frente a XSS según las políticas de seguridad de la organización.
- El backend actual no expone una operación para editar el perfil; Ajustes permite consultarlo, no modificarlo.
- La API actual no documenta autenticación multifactor, roles/permisos, multi-tenancy ni renovación de tokens. No están simulados en esta interfaz.
- No hay un script de pruebas automatizadas configurado todavía. La verificación disponible incluye typecheck, lint y build.

## Publicar en GitHub

El repositorio local está inicializado. Para publicarlo, crea un repositorio remoto y configura su URL (reemplaza el marcador):

```bash
git remote add origin https://github.com/edwincoro/taskflow-front.git
git add .
git commit -m "Document Taskflow frontend"
git branch -M main
git push -u origin main
```
