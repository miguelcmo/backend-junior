# Tutorial: Mejora de UI - Project Management System

## Resumen de Mejoras

Este tutorial transforma el frontend básico en una interfaz profesional con:
- Registro de usuarios
- Dashboard con estadísticas
- Tablero Kanban con drag & drop
- Gestión de miembros
- Comentarios en tareas
- Panel de administración

## Dependencias Adicionales

```bash
cd frontend
npm install react-beautiful-dnd @hello-pangea/dnd react-hot-toast
```

> Nota: Usamos `@hello-pangea/dnd` (fork mantenido de react-beautiful-dnd para React 18+)

---

## PASO 1: Estilos Base Mejorados

### 1.1 Actualizar `frontend/src/styles/custom.css`

```css
/* ========================================
   PMS - Project Management System Styles
   ======================================== */

:root {
  --primary: #6366f1;
  --primary-hover: #4f46e5;
  --secondary: #64748b;
  --success: #22c55e;
  --warning: #f59e0b;
  --danger: #ef4444;
  --info: #3b82f6;

  --bg-dark: #0f172a;
  --bg-card: #1e293b;
  --bg-hover: #334155;
  --border-color: #334155;

  --text-primary: #f8fafc;
  --text-secondary: #94a3b8;
  --text-muted: #64748b;
}

* {
  box-sizing: border-box;
}

body {
  background: linear-gradient(135deg, var(--bg-dark), var(--bg-card));
  color: var(--text-primary);
  font-family: "Inter", -apple-system, BlinkMacSystemFont, sans-serif;
  min-height: 100vh;
}

/* Cards */
.card {
  background: var(--bg-card) !important;
  border: 1px solid var(--border-color) !important;
  border-radius: 12px !important;
  transition: transform 0.2s, box-shadow 0.2s;
}

.card:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.3);
}

.card-header {
  background: transparent !important;
  border-bottom: 1px solid var(--border-color) !important;
}

.card-title {
  color: var(--text-primary);
  font-weight: 600;
}

.card-text {
  color: var(--text-secondary);
}

/* Buttons */
.btn-primary {
  background: var(--primary) !important;
  border-color: var(--primary) !important;
}

.btn-primary:hover {
  background: var(--primary-hover) !important;
  border-color: var(--primary-hover) !important;
}

.btn-outline-light {
  border-color: var(--border-color);
  color: var(--text-secondary);
}

.btn-outline-light:hover {
  background: var(--bg-hover);
  border-color: var(--border-color);
}

/* Forms */
.form-control, .form-select {
  background: var(--bg-dark) !important;
  border: 1px solid var(--border-color) !important;
  color: var(--text-primary) !important;
  border-radius: 8px;
}

.form-control:focus, .form-select:focus {
  border-color: var(--primary) !important;
  box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.2) !important;
}

.form-control::placeholder {
  color: var(--text-muted) !important;
}

.form-label {
  color: var(--text-secondary);
  font-weight: 500;
  font-size: 0.875rem;
}

/* Badges */
.badge {
  font-weight: 500;
  padding: 0.4em 0.8em;
  border-radius: 6px;
}

/* Status badges */
.badge-pending { background: var(--warning); color: #000; }
.badge-todo { background: var(--info); }
.badge-in_progress, .badge-in-progress { background: var(--primary); }
.badge-done { background: var(--success); }

/* Priority badges */
.priority-low {
  background: rgba(34, 197, 94, 0.2);
  color: var(--success);
  border: 1px solid var(--success);
}
.priority-medium {
  background: rgba(245, 158, 11, 0.2);
  color: var(--warning);
  border: 1px solid var(--warning);
}
.priority-high {
  background: rgba(239, 68, 68, 0.2);
  color: var(--danger);
  border: 1px solid var(--danger);
}

/* Navbar */
.navbar {
  background: var(--bg-card) !important;
  border-bottom: 1px solid var(--border-color);
  padding: 1rem 0;
}

.navbar-brand {
  font-weight: 700;
  font-size: 1.25rem;
}

/* Stats Cards */
.stat-card {
  background: var(--bg-card);
  border: 1px solid var(--border-color);
  border-radius: 12px;
  padding: 1.5rem;
  text-align: center;
}

.stat-card .stat-value {
  font-size: 2.5rem;
  font-weight: 700;
  color: var(--primary);
}

.stat-card .stat-label {
  color: var(--text-secondary);
  font-size: 0.875rem;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

/* Kanban Board */
.kanban-board {
  display: flex;
  gap: 1rem;
  overflow-x: auto;
  padding-bottom: 1rem;
}

.kanban-column {
  flex: 1;
  min-width: 280px;
  max-width: 320px;
  background: var(--bg-dark);
  border-radius: 12px;
  padding: 1rem;
}

.kanban-column-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
  padding-bottom: 0.75rem;
  border-bottom: 2px solid var(--border-color);
}

.kanban-column-title {
  font-weight: 600;
  font-size: 0.875rem;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.kanban-column-count {
  background: var(--bg-hover);
  padding: 0.25rem 0.5rem;
  border-radius: 6px;
  font-size: 0.75rem;
}

.kanban-task {
  background: var(--bg-card);
  border: 1px solid var(--border-color);
  border-radius: 8px;
  padding: 1rem;
  margin-bottom: 0.75rem;
  cursor: grab;
  transition: transform 0.2s, box-shadow 0.2s;
}

.kanban-task:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
}

.kanban-task.dragging {
  opacity: 0.8;
  transform: rotate(3deg);
}

.kanban-task-title {
  font-weight: 600;
  margin-bottom: 0.5rem;
  color: var(--text-primary);
}

.kanban-task-desc {
  font-size: 0.875rem;
  color: var(--text-secondary);
  margin-bottom: 0.75rem;
}

.kanban-task-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 0.75rem;
}

/* Avatar */
.avatar {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: var(--primary);
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  font-size: 0.75rem;
  color: white;
}

.avatar-sm {
  width: 24px;
  height: 24px;
  font-size: 0.625rem;
}

/* Member list */
.member-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem;
  background: var(--bg-dark);
  border-radius: 8px;
  margin-bottom: 0.5rem;
}

/* Loading Spinner */
.spinner-container {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 3rem;
}

/* Modal dark theme */
.modal-content {
  background: var(--bg-card) !important;
  border: 1px solid var(--border-color) !important;
}

.modal-header {
  border-bottom: 1px solid var(--border-color) !important;
}

.modal-footer {
  border-top: 1px solid var(--border-color) !important;
}

.modal-title {
  color: var(--text-primary);
}

.btn-close {
  filter: invert(1);
}

/* Tables */
.table {
  color: var(--text-primary);
}

.table th {
  border-color: var(--border-color);
  color: var(--text-secondary);
  font-weight: 600;
  text-transform: uppercase;
  font-size: 0.75rem;
  letter-spacing: 0.5px;
}

.table td {
  border-color: var(--border-color);
  vertical-align: middle;
}

/* Comments */
.comment-item {
  background: var(--bg-dark);
  border-radius: 8px;
  padding: 1rem;
  margin-bottom: 0.75rem;
}

.comment-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.5rem;
}

.comment-author {
  font-weight: 600;
  color: var(--text-primary);
}

.comment-date {
  font-size: 0.75rem;
  color: var(--text-muted);
}

.comment-content {
  color: var(--text-secondary);
}

/* Empty state */
.empty-state {
  text-align: center;
  padding: 3rem;
  color: var(--text-muted);
}

.empty-state-icon {
  font-size: 3rem;
  margin-bottom: 1rem;
}

/* Due date styles */
.due-date {
  font-size: 0.75rem;
  color: var(--text-muted);
}

.due-date.overdue {
  color: var(--danger);
  font-weight: 600;
}

.due-date.soon {
  color: var(--warning);
}

/* Scrollbar */
::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}

::-webkit-scrollbar-track {
  background: var(--bg-dark);
}

::-webkit-scrollbar-thumb {
  background: var(--border-color);
  border-radius: 4px;
}

::-webkit-scrollbar-thumb:hover {
  background: var(--secondary);
}
```

---

## PASO 2: Componentes Reutilizables

### 2.1 Crear `frontend/src/components/LoadingSpinner.jsx`

```jsx
const LoadingSpinner = ({ text = "Cargando..." }) => {
  return (
    <div className="spinner-container">
      <div className="text-center">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <p className="mt-2 text-secondary">{text}</p>
      </div>
    </div>
  );
};

export default LoadingSpinner;
```

### 2.2 Crear `frontend/src/components/StatsCard.jsx`

```jsx
const StatsCard = ({ value, label, icon, color = "primary" }) => {
  const colors = {
    primary: "#6366f1",
    success: "#22c55e",
    warning: "#f59e0b",
    danger: "#ef4444",
    info: "#3b82f6"
  };

  return (
    <div className="stat-card">
      {icon && (
        <div style={{ fontSize: "1.5rem", marginBottom: "0.5rem" }}>
          {icon}
        </div>
      )}
      <div className="stat-value" style={{ color: colors[color] || colors.primary }}>
        {value}
      </div>
      <div className="stat-label">{label}</div>
    </div>
  );
};

export default StatsCard;
```

### 2.3 Crear `frontend/src/components/TaskCard.jsx`

```jsx
const TaskCard = ({ task, onClick, showProject = false }) => {
  const getPriorityClass = (priority) => {
    return `badge priority-${priority || 'medium'}`;
  };

  const getStatusClass = (status) => {
    return `badge badge-${status || 'todo'}`;
  };

  const formatStatus = (status) => {
    const statusMap = {
      pending: "Pendiente",
      todo: "Por hacer",
      in_progress: "En progreso",
      done: "Completada"
    };
    return statusMap[status] || status;
  };

  const isOverdue = () => {
    if (!task.due_date) return false;
    return new Date(task.due_date) < new Date() && task.status !== 'done';
  };

  const formatDate = (date) => {
    if (!date) return null;
    return new Date(date).toLocaleDateString('es-ES', {
      day: 'numeric',
      month: 'short'
    });
  };

  return (
    <div
      className="kanban-task"
      onClick={() => onClick && onClick(task)}
      style={{ cursor: onClick ? 'pointer' : 'default' }}
    >
      <div className="kanban-task-title">{task.title}</div>

      {task.description && (
        <div className="kanban-task-desc">
          {task.description.length > 80
            ? task.description.substring(0, 80) + '...'
            : task.description}
        </div>
      )}

      {showProject && task.project_name && (
        <div className="mb-2">
          <small className="text-muted">📁 {task.project_name}</small>
        </div>
      )}

      <div className="kanban-task-footer">
        <span className={getPriorityClass(task.priority)}>
          {task.priority || 'medium'}
        </span>

        <div className="d-flex align-items-center gap-2">
          {task.due_date && (
            <span className={`due-date ${isOverdue() ? 'overdue' : ''}`}>
              📅 {formatDate(task.due_date)}
            </span>
          )}

          {task.user_name && (
            <div className="avatar avatar-sm" title={task.user_name}>
              {task.user_name.charAt(0).toUpperCase()}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TaskCard;
```

### 2.4 Crear `frontend/src/components/Modal.jsx`

```jsx
import { useEffect } from 'react';

const Modal = ({ show, onClose, title, children, footer, size = 'md' }) => {
  useEffect(() => {
    if (show) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [show]);

  if (!show) return null;

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <>
      <div
        className="modal fade show"
        style={{ display: 'block' }}
        onClick={handleBackdropClick}
      >
        <div className={`modal-dialog modal-${size} modal-dialog-centered`}>
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">{title}</h5>
              <button
                type="button"
                className="btn-close"
                onClick={onClose}
              />
            </div>
            <div className="modal-body">
              {children}
            </div>
            {footer && (
              <div className="modal-footer">
                {footer}
              </div>
            )}
          </div>
        </div>
      </div>
      <div className="modal-backdrop fade show" />
    </>
  );
};

export default Modal;
```

---

## PASO 3: Página de Registro

### 3.1 Crear `frontend/src/pages/Register.jsx`

```jsx
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import client from "../api/client";
import toast from "react-hot-toast";

const Register = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: ""
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const validate = () => {
    const newErrors = {};

    if (!formData.name || formData.name.length < 2) {
      newErrors.name = "El nombre debe tener al menos 2 caracteres";
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      newErrors.email = "Email no valido";
    }

    if (formData.password.length < 6) {
      newErrors.password = "La contraseña debe tener al menos 6 caracteres";
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Las contraseñas no coinciden";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    // Clear error when typing
    if (errors[e.target.name]) {
      setErrors({ ...errors, [e.target.name]: null });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validate()) return;

    setLoading(true);
    try {
      await client.post("/auth/register", {
        name: formData.name,
        email: formData.email,
        password: formData.password
      });

      toast.success("Cuenta creada exitosamente");
      navigate("/");
    } catch (error) {
      const message = error.response?.data?.error || "Error al registrar";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <div className="row justify-content-center align-items-center min-vh-100">
        <div className="col-md-5 col-lg-4">
          <div className="card p-4">
            <div className="text-center mb-4">
              <h2 className="fw-bold">Crear Cuenta</h2>
              <p className="text-secondary">Unete al equipo</p>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label className="form-label">Nombre</label>
                <input
                  type="text"
                  name="name"
                  className={`form-control ${errors.name ? 'is-invalid' : ''}`}
                  placeholder="Tu nombre"
                  value={formData.name}
                  onChange={handleChange}
                />
                {errors.name && (
                  <div className="invalid-feedback">{errors.name}</div>
                )}
              </div>

              <div className="mb-3">
                <label className="form-label">Email</label>
                <input
                  type="email"
                  name="email"
                  className={`form-control ${errors.email ? 'is-invalid' : ''}`}
                  placeholder="tu@email.com"
                  value={formData.email}
                  onChange={handleChange}
                />
                {errors.email && (
                  <div className="invalid-feedback">{errors.email}</div>
                )}
              </div>

              <div className="mb-3">
                <label className="form-label">Contraseña</label>
                <input
                  type="password"
                  name="password"
                  className={`form-control ${errors.password ? 'is-invalid' : ''}`}
                  placeholder="Minimo 6 caracteres"
                  value={formData.password}
                  onChange={handleChange}
                />
                {errors.password && (
                  <div className="invalid-feedback">{errors.password}</div>
                )}
              </div>

              <div className="mb-4">
                <label className="form-label">Confirmar Contraseña</label>
                <input
                  type="password"
                  name="confirmPassword"
                  className={`form-control ${errors.confirmPassword ? 'is-invalid' : ''}`}
                  placeholder="Repite la contraseña"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                />
                {errors.confirmPassword && (
                  <div className="invalid-feedback">{errors.confirmPassword}</div>
                )}
              </div>

              <button
                type="submit"
                className="btn btn-primary w-100"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2" />
                    Creando cuenta...
                  </>
                ) : (
                  "Crear Cuenta"
                )}
              </button>
            </form>

            <div className="text-center mt-4">
              <span className="text-secondary">¿Ya tienes cuenta? </span>
              <Link to="/" className="text-primary text-decoration-none">
                Inicia sesion
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
```

### 3.2 Actualizar `frontend/src/pages/Login.jsx`

```jsx
import { useState, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import client from "../api/client";
import toast from "react-hot-toast";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      toast.error("Completa todos los campos");
      return;
    }

    setLoading(true);
    try {
      const response = await client.post("/auth/login", { email, password });
      login(response.data.token);
      toast.success("Bienvenido!");
      navigate("/dashboard");
    } catch (error) {
      const message = error.response?.data?.error || "Error al iniciar sesion";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <div className="row justify-content-center align-items-center min-vh-100">
        <div className="col-md-5 col-lg-4">
          <div className="card p-4">
            <div className="text-center mb-4">
              <h2 className="fw-bold">PMS</h2>
              <p className="text-secondary">Project Management System</p>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label className="form-label">Email</label>
                <input
                  type="email"
                  className="form-control"
                  placeholder="tu@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              <div className="mb-4">
                <label className="form-label">Contraseña</label>
                <input
                  type="password"
                  className="form-control"
                  placeholder="Tu contraseña"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>

              <button
                type="submit"
                className="btn btn-primary w-100"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2" />
                    Iniciando...
                  </>
                ) : (
                  "Iniciar Sesion"
                )}
              </button>
            </form>

            <div className="text-center mt-4">
              <span className="text-secondary">¿No tienes cuenta? </span>
              <Link to="/register" className="text-primary text-decoration-none">
                Registrate
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
```

### 3.3 Actualizar rutas en `frontend/src/routes/AppRouter.jsx`

```jsx
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "../pages/Login";
import Register from "../pages/Register";
import Dashboard from "../pages/Dashboard";
import Tasks from "../pages/Tasks";
import PrivateRoute from "./PrivateRoute";

const AppRouter = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          }
        />
        <Route
          path="/tasks/:projectId"
          element={
            <PrivateRoute>
              <Tasks />
            </PrivateRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
};

export default AppRouter;
```

### 3.4 Configurar Toast en `frontend/src/App.jsx`

```jsx
import "bootstrap/dist/css/bootstrap.min.css";
import "./styles/custom.css";
import { Toaster } from "react-hot-toast";
import { AuthProvider } from "./context/AuthProvider";
import AppRouter from "./routes/AppRouter";

function App() {
  return (
    <AuthProvider>
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: '#1e293b',
            color: '#f8fafc',
            border: '1px solid #334155'
          }
        }}
      />
      <AppRouter />
    </AuthProvider>
  );
}

export default App;
```

---

## PASO 4: Dashboard con Estadisticas

### 4.1 Actualizar `frontend/src/pages/Dashboard.jsx`

```jsx
import { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import client from "../api/client";
import toast from "react-hot-toast";
import Navbar from "../components/Navbar";
import StatsCard from "../components/StatsCard";
import LoadingSpinner from "../components/LoadingSpinner";
import Modal from "../components/Modal";

const Dashboard = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const [projects, setProjects] = useState([]);
  const [myProjects, setMyProjects] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({ name: "", description: "" });
  const [submitting, setSubmitting] = useState(false);
  const [activeTab, setActiveTab] = useState("all");

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [projectsRes, statsRes, myProjectsRes] = await Promise.all([
        client.get("/projects"),
        client.get("/stats"),
        client.get("/me/projects")
      ]);

      setProjects(projectsRes.data);
      setStats(statsRes.data);
      setMyProjects(myProjectsRes.data);
    } catch (error) {
      toast.error("Error al cargar datos");
    } finally {
      setLoading(false);
    }
  };

  const handleCreateProject = async (e) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      toast.error("El nombre es requerido");
      return;
    }

    setSubmitting(true);
    try {
      const response = await client.post("/projects", formData);
      setProjects([...projects, response.data]);
      setMyProjects([...myProjects, { ...response.data, my_role: 'owner' }]);
      setShowModal(false);
      setFormData({ name: "", description: "" });
      toast.success("Proyecto creado");

      // Update stats
      if (stats) {
        setStats({
          ...stats,
          totalProjects: stats.totalProjects + 1,
          myProjects: stats.myProjects + 1
        });
      }
    } catch (error) {
      toast.error("Error al crear proyecto");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteProject = async (id) => {
    if (!confirm("¿Eliminar este proyecto?")) return;

    try {
      await client.delete(`/projects/${id}`);
      setProjects(projects.filter(p => p.id !== id));
      setMyProjects(myProjects.filter(p => p.id !== id));
      toast.success("Proyecto eliminado");
    } catch (error) {
      toast.error("Error al eliminar");
    }
  };

  const displayProjects = activeTab === "mine" ? myProjects : projects;

  if (loading) return <LoadingSpinner text="Cargando dashboard..." />;

  return (
    <>
      <Navbar />
      <div className="container py-4">
        {/* Stats Section */}
        {stats && (
          <div className="row g-3 mb-4">
            <div className="col-6 col-md-3">
              <StatsCard
                value={stats.totalProjects}
                label="Proyectos"
                color="primary"
              />
            </div>
            <div className="col-6 col-md-3">
              <StatsCard
                value={stats.totalTasks}
                label="Tareas"
                color="info"
              />
            </div>
            <div className="col-6 col-md-3">
              <StatsCard
                value={stats.myTasks || 0}
                label="Mis Tareas"
                color="warning"
              />
            </div>
            <div className="col-6 col-md-3">
              <StatsCard
                value={stats.completedTasks || 0}
                label="Completadas"
                color="success"
              />
            </div>
          </div>
        )}

        {/* Projects Header */}
        <div className="d-flex justify-content-between align-items-center mb-4">
          <div>
            <h4 className="mb-0">Proyectos</h4>
            <div className="btn-group mt-2">
              <button
                className={`btn btn-sm ${activeTab === 'all' ? 'btn-primary' : 'btn-outline-light'}`}
                onClick={() => setActiveTab('all')}
              >
                Todos ({projects.length})
              </button>
              <button
                className={`btn btn-sm ${activeTab === 'mine' ? 'btn-primary' : 'btn-outline-light'}`}
                onClick={() => setActiveTab('mine')}
              >
                Mis Proyectos ({myProjects.length})
              </button>
            </div>
          </div>
          <button
            className="btn btn-primary"
            onClick={() => setShowModal(true)}
          >
            + Nuevo Proyecto
          </button>
        </div>

        {/* Projects Grid */}
        {displayProjects.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon">📁</div>
            <p>No hay proyectos</p>
          </div>
        ) : (
          <div className="row g-3">
            {displayProjects.map((project) => (
              <div key={project.id} className="col-md-6 col-lg-4">
                <div className="card h-100">
                  <div className="card-body">
                    <div className="d-flex justify-content-between align-items-start mb-2">
                      <h5 className="card-title mb-0">{project.name}</h5>
                      {project.my_role && (
                        <span className={`badge ${project.my_role === 'owner' ? 'bg-primary' : 'bg-secondary'}`}>
                          {project.my_role}
                        </span>
                      )}
                    </div>
                    <p className="card-text">{project.description || "Sin descripcion"}</p>
                    <span className={`badge badge-${project.status || 'todo'}`}>
                      {project.status || 'active'}
                    </span>
                  </div>
                  <div className="card-footer bg-transparent border-0 pt-0">
                    <div className="d-flex gap-2">
                      <button
                        className="btn btn-sm btn-primary flex-grow-1"
                        onClick={() => navigate(`/tasks/${project.id}`)}
                      >
                        Ver Tareas
                      </button>
                      {user?.role === "admin" && (
                        <button
                          className="btn btn-sm btn-outline-danger"
                          onClick={() => handleDeleteProject(project.id)}
                        >
                          🗑️
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Create Project Modal */}
        <Modal
          show={showModal}
          onClose={() => setShowModal(false)}
          title="Nuevo Proyecto"
          footer={
            <>
              <button
                className="btn btn-outline-light"
                onClick={() => setShowModal(false)}
              >
                Cancelar
              </button>
              <button
                className="btn btn-primary"
                onClick={handleCreateProject}
                disabled={submitting}
              >
                {submitting ? "Creando..." : "Crear Proyecto"}
              </button>
            </>
          }
        >
          <form onSubmit={handleCreateProject}>
            <div className="mb-3">
              <label className="form-label">Nombre del Proyecto</label>
              <input
                type="text"
                className="form-control"
                placeholder="Mi nuevo proyecto"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>
            <div className="mb-3">
              <label className="form-label">Descripcion</label>
              <textarea
                className="form-control"
                rows="3"
                placeholder="Describe el proyecto..."
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              />
            </div>
          </form>
        </Modal>
      </div>
    </>
  );
};

export default Dashboard;
```

---

## PASO 5: Tablero Kanban con Drag & Drop

Este es el paso mas importante. Crearemos un tablero Kanban completo.

### 5.1 Crear `frontend/src/components/KanbanBoard.jsx`

```jsx
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import TaskCard from "./TaskCard";

const COLUMNS = [
  { id: "pending", title: "Pendiente", color: "#f59e0b" },
  { id: "todo", title: "Por Hacer", color: "#3b82f6" },
  { id: "in_progress", title: "En Progreso", color: "#6366f1" },
  { id: "done", title: "Completado", color: "#22c55e" }
];

const KanbanBoard = ({ tasks, onTaskMove, onTaskClick }) => {
  // Group tasks by status
  const getTasksByStatus = (status) => {
    return tasks.filter(task => task.status === status);
  };

  const handleDragEnd = (result) => {
    const { destination, source, draggableId } = result;

    // Dropped outside a column
    if (!destination) return;

    // Dropped in same position
    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return;
    }

    // Get the task and new status
    const taskId = parseInt(draggableId);
    const newStatus = destination.droppableId;

    onTaskMove(taskId, newStatus);
  };

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <div className="kanban-board">
        {COLUMNS.map((column) => {
          const columnTasks = getTasksByStatus(column.id);

          return (
            <div key={column.id} className="kanban-column">
              <div className="kanban-column-header">
                <span
                  className="kanban-column-title"
                  style={{ color: column.color }}
                >
                  {column.title}
                </span>
                <span className="kanban-column-count">
                  {columnTasks.length}
                </span>
              </div>

              <Droppable droppableId={column.id}>
                {(provided, snapshot) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    style={{
                      minHeight: "200px",
                      background: snapshot.isDraggingOver
                        ? "rgba(99, 102, 241, 0.1)"
                        : "transparent",
                      borderRadius: "8px",
                      transition: "background 0.2s"
                    }}
                  >
                    {columnTasks.map((task, index) => (
                      <Draggable
                        key={task.id}
                        draggableId={String(task.id)}
                        index={index}
                      >
                        {(provided, snapshot) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            style={{
                              ...provided.draggableProps.style,
                              opacity: snapshot.isDragging ? 0.8 : 1
                            }}
                          >
                            <TaskCard
                              task={task}
                              onClick={onTaskClick}
                            />
                          </div>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}

                    {columnTasks.length === 0 && (
                      <div className="text-center py-4 text-muted">
                        <small>Arrastra tareas aqui</small>
                      </div>
                    )}
                  </div>
                )}
              </Droppable>
            </div>
          );
        })}
      </div>
    </DragDropContext>
  );
};

export default KanbanBoard;
```

### 5.2 Actualizar `frontend/src/pages/Tasks.jsx` completo

```jsx
import { useState, useEffect, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import client from "../api/client";
import toast from "react-hot-toast";
import Navbar from "../components/Navbar";
import KanbanBoard from "../components/KanbanBoard";
import LoadingSpinner from "../components/LoadingSpinner";
import Modal from "../components/Modal";

const Tasks = () => {
  const { projectId } = useParams();
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const [project, setProject] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modal states
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    priority: "medium",
    status: "todo",
    user_id: "",
    due_date: ""
  });

  useEffect(() => {
    loadData();
  }, [projectId]);

  const loadData = async () => {
    try {
      const [projectRes, tasksRes, membersRes] = await Promise.all([
        client.get(`/projects/${projectId}`),
        client.get(`/projects/${projectId}/tasks`),
        client.get(`/projects/${projectId}/members`)
      ]);

      setProject(projectRes.data);
      setTasks(tasksRes.data);
      setMembers(membersRes.data);
    } catch (error) {
      toast.error("Error al cargar el proyecto");
      navigate("/dashboard");
    } finally {
      setLoading(false);
    }
  };

  const handleTaskMove = async (taskId, newStatus) => {
    // Optimistic update
    setTasks(tasks.map(task =>
      task.id === taskId ? { ...task, status: newStatus } : task
    ));

    try {
      await client.put(`/tasks/${taskId}`, { status: newStatus });
      toast.success("Estado actualizado");
    } catch (error) {
      // Revert on error
      loadData();
      toast.error("Error al actualizar estado");
    }
  };

  const handleTaskClick = (task) => {
    setSelectedTask(task);
    setFormData({
      title: task.title,
      description: task.description || "",
      priority: task.priority || "medium",
      status: task.status || "todo",
      user_id: task.user_id || "",
      due_date: task.due_date ? task.due_date.split('T')[0] : ""
    });
    setShowEditModal(true);
  };

  const handleCreateTask = async (e) => {
    e.preventDefault();
    if (!formData.title.trim()) {
      toast.error("El titulo es requerido");
      return;
    }

    setSubmitting(true);
    try {
      const response = await client.post(`/projects/${projectId}/tasks`, {
        ...formData,
        user_id: formData.user_id || null
      });

      // Add user name to new task for display
      const newTask = response.data;
      if (newTask.user_id) {
        const member = members.find(m => m.user_id === newTask.user_id);
        newTask.user_name = member?.user_name || "";
      }

      setTasks([...tasks, newTask]);
      setShowCreateModal(false);
      resetForm();
      toast.success("Tarea creada");
    } catch (error) {
      toast.error(error.response?.data?.error || "Error al crear tarea");
    } finally {
      setSubmitting(false);
    }
  };

  const handleUpdateTask = async (e) => {
    e.preventDefault();
    if (!formData.title.trim()) {
      toast.error("El titulo es requerido");
      return;
    }

    setSubmitting(true);
    try {
      await client.put(`/tasks/${selectedTask.id}`, {
        ...formData,
        user_id: formData.user_id || null
      });

      // Update local state
      setTasks(tasks.map(task => {
        if (task.id === selectedTask.id) {
          const member = members.find(m => m.user_id == formData.user_id);
          return {
            ...task,
            ...formData,
            user_name: member?.user_name || ""
          };
        }
        return task;
      }));

      setShowEditModal(false);
      setSelectedTask(null);
      toast.success("Tarea actualizada");
    } catch (error) {
      toast.error("Error al actualizar tarea");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteTask = async () => {
    if (!confirm("¿Eliminar esta tarea?")) return;

    try {
      await client.delete(`/tasks/${selectedTask.id}`);
      setTasks(tasks.filter(t => t.id !== selectedTask.id));
      setShowEditModal(false);
      setSelectedTask(null);
      toast.success("Tarea eliminada");
    } catch (error) {
      toast.error("Error al eliminar tarea");
    }
  };

  const resetForm = () => {
    setFormData({
      title: "",
      description: "",
      priority: "medium",
      status: "todo",
      user_id: "",
      due_date: ""
    });
  };

  if (loading) return <LoadingSpinner text="Cargando proyecto..." />;

  return (
    <>
      <Navbar />
      <div className="container-fluid py-4">
        {/* Header */}
        <div className="d-flex justify-content-between align-items-center mb-4">
          <div>
            <button
              className="btn btn-sm btn-outline-light mb-2"
              onClick={() => navigate("/dashboard")}
            >
              ← Volver
            </button>
            <h4 className="mb-0">{project?.name}</h4>
            <small className="text-muted">{project?.description}</small>
          </div>
          <button
            className="btn btn-primary"
            onClick={() => {
              resetForm();
              setShowCreateModal(true);
            }}
          >
            + Nueva Tarea
          </button>
        </div>

        {/* Kanban Board */}
        <KanbanBoard
          tasks={tasks}
          onTaskMove={handleTaskMove}
          onTaskClick={handleTaskClick}
        />

        {/* Create Task Modal */}
        <Modal
          show={showCreateModal}
          onClose={() => setShowCreateModal(false)}
          title="Nueva Tarea"
          size="lg"
          footer={
            <>
              <button
                className="btn btn-outline-light"
                onClick={() => setShowCreateModal(false)}
              >
                Cancelar
              </button>
              <button
                className="btn btn-primary"
                onClick={handleCreateTask}
                disabled={submitting}
              >
                {submitting ? "Creando..." : "Crear Tarea"}
              </button>
            </>
          }
        >
          <TaskForm
            formData={formData}
            setFormData={setFormData}
            members={members}
          />
        </Modal>

        {/* Edit Task Modal */}
        <Modal
          show={showEditModal}
          onClose={() => {
            setShowEditModal(false);
            setSelectedTask(null);
          }}
          title="Editar Tarea"
          size="lg"
          footer={
            <>
              <button
                className="btn btn-outline-danger me-auto"
                onClick={handleDeleteTask}
              >
                Eliminar
              </button>
              <button
                className="btn btn-outline-light"
                onClick={() => {
                  setShowEditModal(false);
                  setSelectedTask(null);
                }}
              >
                Cancelar
              </button>
              <button
                className="btn btn-primary"
                onClick={handleUpdateTask}
                disabled={submitting}
              >
                {submitting ? "Guardando..." : "Guardar Cambios"}
              </button>
            </>
          }
        >
          <TaskForm
            formData={formData}
            setFormData={setFormData}
            members={members}
          />
        </Modal>
      </div>
    </>
  );
};

// Task Form Component
const TaskForm = ({ formData, setFormData, members }) => {
  return (
    <form>
      <div className="row">
        <div className="col-12 mb-3">
          <label className="form-label">Titulo *</label>
          <input
            type="text"
            className="form-control"
            placeholder="Titulo de la tarea"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          />
        </div>

        <div className="col-12 mb-3">
          <label className="form-label">Descripcion</label>
          <textarea
            className="form-control"
            rows="3"
            placeholder="Describe la tarea..."
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          />
        </div>

        <div className="col-md-6 mb-3">
          <label className="form-label">Estado</label>
          <select
            className="form-select"
            value={formData.status}
            onChange={(e) => setFormData({ ...formData, status: e.target.value })}
          >
            <option value="pending">Pendiente</option>
            <option value="todo">Por Hacer</option>
            <option value="in_progress">En Progreso</option>
            <option value="done">Completado</option>
          </select>
        </div>

        <div className="col-md-6 mb-3">
          <label className="form-label">Prioridad</label>
          <select
            className="form-select"
            value={formData.priority}
            onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
          >
            <option value="low">Baja</option>
            <option value="medium">Media</option>
            <option value="high">Alta</option>
          </select>
        </div>

        <div className="col-md-6 mb-3">
          <label className="form-label">Asignar a</label>
          <select
            className="form-select"
            value={formData.user_id}
            onChange={(e) => setFormData({ ...formData, user_id: e.target.value })}
          >
            <option value="">Sin asignar</option>
            {members.map((member) => (
              <option key={member.user_id} value={member.user_id}>
                {member.user_name} ({member.role})
              </option>
            ))}
          </select>
        </div>

        <div className="col-md-6 mb-3">
          <label className="form-label">Fecha limite</label>
          <input
            type="date"
            className="form-control"
            value={formData.due_date}
            onChange={(e) => setFormData({ ...formData, due_date: e.target.value })}
          />
        </div>
      </div>
    </form>
  );
};

export default Tasks;
```

---

## PASO 6: Navbar Mejorado

### 6.1 Actualizar `frontend/src/components/Navbar.jsx`

```jsx
import { useContext } from "react";
import { useNavigate, Link, useLocation } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="navbar navbar-expand-lg navbar-dark">
      <div className="container">
        <Link to="/dashboard" className="navbar-brand">
          <span className="text-primary fw-bold">PMS</span>
        </Link>

        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav me-auto">
            <li className="nav-item">
              <Link
                to="/dashboard"
                className={`nav-link ${isActive('/dashboard') ? 'active' : ''}`}
              >
                Dashboard
              </Link>
            </li>
            <li className="nav-item">
              <Link
                to="/my-tasks"
                className={`nav-link ${isActive('/my-tasks') ? 'active' : ''}`}
              >
                Mis Tareas
              </Link>
            </li>
            {user?.role === 'admin' && (
              <li className="nav-item">
                <Link
                  to="/admin"
                  className={`nav-link ${isActive('/admin') ? 'active' : ''}`}
                >
                  Admin
                </Link>
              </li>
            )}
          </ul>

          <div className="d-flex align-items-center gap-3">
            <div className="d-flex align-items-center gap-2">
              <div className="avatar">
                {user?.name?.charAt(0).toUpperCase() || user?.email?.charAt(0).toUpperCase()}
              </div>
              <div className="d-none d-md-block">
                <div className="text-white small fw-medium">
                  {user?.name || user?.email}
                </div>
                <div className="text-muted" style={{ fontSize: '0.75rem' }}>
                  {user?.role}
                </div>
              </div>
            </div>
            <button
              className="btn btn-sm btn-outline-light"
              onClick={handleLogout}
            >
              Salir
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
```

---

## PASO 7: Pagina Mis Tareas

### 7.1 Crear `frontend/src/pages/MyTasks.jsx`

```jsx
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import client from "../api/client";
import toast from "react-hot-toast";
import Navbar from "../components/Navbar";
import TaskCard from "../components/TaskCard";
import LoadingSpinner from "../components/LoadingSpinner";

const MyTasks = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const navigate = useNavigate();

  useEffect(() => {
    loadTasks();
  }, []);

  const loadTasks = async () => {
    try {
      const response = await client.get("/me/tasks");
      setTasks(response.data);
    } catch (error) {
      toast.error("Error al cargar tareas");
    } finally {
      setLoading(false);
    }
  };

  const filteredTasks = filter === "all"
    ? tasks
    : tasks.filter(t => t.status === filter);

  // Group by project
  const tasksByProject = filteredTasks.reduce((acc, task) => {
    const projectName = task.project_name || "Sin proyecto";
    if (!acc[projectName]) {
      acc[projectName] = { tasks: [], projectId: task.project_id };
    }
    acc[projectName].tasks.push(task);
    return acc;
  }, {});

  if (loading) return <LoadingSpinner text="Cargando mis tareas..." />;

  return (
    <>
      <Navbar />
      <div className="container py-4">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h4 className="mb-0">Mis Tareas ({tasks.length})</h4>

          <select
            className="form-select"
            style={{ width: 'auto' }}
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          >
            <option value="all">Todas</option>
            <option value="pending">Pendientes</option>
            <option value="todo">Por hacer</option>
            <option value="in_progress">En progreso</option>
            <option value="done">Completadas</option>
          </select>
        </div>

        {Object.keys(tasksByProject).length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon">📋</div>
            <p>No tienes tareas asignadas</p>
          </div>
        ) : (
          Object.entries(tasksByProject).map(([projectName, { tasks, projectId }]) => (
            <div key={projectName} className="mb-4">
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h5 className="text-secondary mb-0">📁 {projectName}</h5>
                <button
                  className="btn btn-sm btn-outline-primary"
                  onClick={() => navigate(`/tasks/${projectId}`)}
                >
                  Ver Tablero
                </button>
              </div>
              <div className="row g-3">
                {tasks.map(task => (
                  <div key={task.id} className="col-md-6 col-lg-4">
                    <TaskCard
                      task={task}
                      onClick={() => navigate(`/tasks/${task.project_id}`)}
                    />
                  </div>
                ))}
              </div>
            </div>
          ))
        )}
      </div>
    </>
  );
};

export default MyTasks;
```

### 7.2 Agregar ruta en `AppRouter.jsx`

Añadir en las rutas:

```jsx
import MyTasks from "../pages/MyTasks";

// Dentro de Routes, añadir:
<Route
  path="/my-tasks"
  element={
    <PrivateRoute>
      <MyTasks />
    </PrivateRoute>
  }
/>
```

---

## PASO 8: Sistema de Comentarios

### 8.1 Crear `frontend/src/components/CommentSection.jsx`

```jsx
import { useState, useEffect, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import client from "../api/client";
import toast from "react-hot-toast";

const CommentSection = ({ taskId }) => {
  const { user } = useContext(AuthContext);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    loadComments();
  }, [taskId]);

  const loadComments = async () => {
    try {
      const response = await client.get(`/tasks/${taskId}/comments`);
      setComments(response.data);
    } catch (error) {
      console.error("Error loading comments");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    setSubmitting(true);
    try {
      const response = await client.post(`/tasks/${taskId}/comments`, {
        content: newComment
      });
      setComments([...comments, response.data]);
      setNewComment("");
      toast.success("Comentario agregado");
    } catch (error) {
      toast.error("Error al agregar comentario");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (commentId) => {
    if (!confirm("¿Eliminar comentario?")) return;

    try {
      await client.delete(`/comments/${commentId}`);
      setComments(comments.filter(c => c.id !== commentId));
      toast.success("Comentario eliminado");
    } catch (error) {
      toast.error("Error al eliminar");
    }
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('es-ES', {
      day: 'numeric',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="mt-4">
      <h6 className="mb-3">Comentarios ({comments.length})</h6>

      {/* Comment Form */}
      <form onSubmit={handleSubmit} className="mb-3">
        <div className="d-flex gap-2">
          <input
            type="text"
            className="form-control"
            placeholder="Escribe un comentario..."
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
          />
          <button
            type="submit"
            className="btn btn-primary"
            disabled={submitting || !newComment.trim()}
          >
            {submitting ? "..." : "Enviar"}
          </button>
        </div>
      </form>

      {/* Comments List */}
      {loading ? (
        <div className="text-center py-3">
          <div className="spinner-border spinner-border-sm" />
        </div>
      ) : comments.length === 0 ? (
        <p className="text-muted small">No hay comentarios aun</p>
      ) : (
        <div className="comments-list">
          {comments.map(comment => (
            <div key={comment.id} className="comment-item">
              <div className="comment-header">
                <div className="d-flex align-items-center gap-2">
                  <div className="avatar avatar-sm">
                    {comment.user_name?.charAt(0).toUpperCase() || "?"}
                  </div>
                  <span className="comment-author">{comment.user_name}</span>
                  <span className="comment-date">{formatDate(comment.created_at)}</span>
                </div>
                {(comment.user_id === user?.id || user?.role === 'admin') && (
                  <button
                    className="btn btn-sm btn-link text-danger p-0"
                    onClick={() => handleDelete(comment.id)}
                  >
                    🗑️
                  </button>
                )}
              </div>
              <div className="comment-content mt-2">{comment.content}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CommentSection;
```

### 8.2 Integrar comentarios en el modal de edicion de Tasks.jsx

En el modal de edicion de tarea, añadir despues del TaskForm:

```jsx
{selectedTask && (
  <CommentSection taskId={selectedTask.id} />
)}
```

Y agregar el import:
```jsx
import CommentSection from "../components/CommentSection";
```

---

## PASO 9: Gestion de Miembros

### 9.1 Crear `frontend/src/components/MemberList.jsx`

```jsx
import { useState, useEffect, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import client from "../api/client";
import toast from "react-hot-toast";

const MemberList = ({ projectId, isOwner }) => {
  const { user } = useContext(AuthContext);
  const [members, setMembers] = useState([]);
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState("");
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(false);

  const canManage = isOwner || user?.role === 'admin';

  useEffect(() => {
    loadData();
  }, [projectId]);

  const loadData = async () => {
    try {
      const [membersRes, usersRes] = await Promise.all([
        client.get(`/projects/${projectId}/members`),
        client.get("/users")
      ]);
      setMembers(membersRes.data);
      setUsers(usersRes.data);
    } catch (error) {
      toast.error("Error al cargar miembros");
    } finally {
      setLoading(false);
    }
  };

  // Users not yet members
  const availableUsers = users.filter(
    u => !members.some(m => m.user_id === u.id)
  );

  const handleAddMember = async () => {
    if (!selectedUser) return;

    setAdding(true);
    try {
      await client.post(`/projects/${projectId}/members`, {
        user_id: parseInt(selectedUser)
      });
      await loadData();
      setSelectedUser("");
      toast.success("Miembro agregado");
    } catch (error) {
      toast.error(error.response?.data?.error || "Error al agregar");
    } finally {
      setAdding(false);
    }
  };

  const handleRemoveMember = async (userId) => {
    if (!confirm("¿Remover este miembro?")) return;

    try {
      await client.delete(`/projects/${projectId}/members/${userId}`);
      setMembers(members.filter(m => m.user_id !== userId));
      toast.success("Miembro removido");
    } catch (error) {
      toast.error("Error al remover");
    }
  };

  if (loading) {
    return <div className="text-center py-3"><div className="spinner-border spinner-border-sm" /></div>;
  }

  return (
    <div>
      <h6 className="mb-3">Miembros del Proyecto ({members.length})</h6>

      {/* Add Member Form */}
      {canManage && availableUsers.length > 0 && (
        <div className="d-flex gap-2 mb-3">
          <select
            className="form-select"
            value={selectedUser}
            onChange={(e) => setSelectedUser(e.target.value)}
          >
            <option value="">Seleccionar usuario...</option>
            {availableUsers.map(u => (
              <option key={u.id} value={u.id}>{u.name} ({u.email})</option>
            ))}
          </select>
          <button
            className="btn btn-primary"
            onClick={handleAddMember}
            disabled={adding || !selectedUser}
          >
            {adding ? "..." : "Agregar"}
          </button>
        </div>
      )}

      {/* Members List */}
      {members.length === 0 ? (
        <p className="text-muted small">No hay miembros</p>
      ) : (
        members.map(member => (
          <div key={member.user_id} className="member-item">
            <div className="avatar">
              {member.user_name?.charAt(0).toUpperCase()}
            </div>
            <div className="flex-grow-1">
              <div className="fw-medium">{member.user_name}</div>
              <small className="text-muted">{member.user_email}</small>
            </div>
            <span className={`badge ${member.role === 'owner' ? 'bg-primary' : 'bg-secondary'}`}>
              {member.role}
            </span>
            {canManage && member.role !== 'owner' && (
              <button
                className="btn btn-sm btn-link text-danger"
                onClick={() => handleRemoveMember(member.user_id)}
              >
                ✕
              </button>
            )}
          </div>
        ))
      )}
    </div>
  );
};

export default MemberList;
```

### 9.2 Crear pagina de detalle de proyecto `frontend/src/pages/ProjectDetail.jsx`

```jsx
import { useState, useEffect, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import client from "../api/client";
import toast from "react-hot-toast";
import Navbar from "../components/Navbar";
import MemberList from "../components/MemberList";
import LoadingSpinner from "../components/LoadingSpinner";
import StatsCard from "../components/StatsCard";

const ProjectDetail = () => {
  const { projectId } = useParams();
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const [project, setProject] = useState(null);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, [projectId]);

  const loadData = async () => {
    try {
      const [projectRes, statsRes] = await Promise.all([
        client.get(`/projects/${projectId}`),
        client.get(`/stats/projects/${projectId}`)
      ]);
      setProject(projectRes.data);
      setStats(statsRes.data);
    } catch (error) {
      toast.error("Error al cargar proyecto");
      navigate("/dashboard");
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <LoadingSpinner />;

  const isOwner = project?.owner_id === user?.id;

  return (
    <>
      <Navbar />
      <div className="container py-4">
        <button
          className="btn btn-sm btn-outline-light mb-3"
          onClick={() => navigate("/dashboard")}
        >
          ← Volver
        </button>

        <div className="row">
          {/* Project Info */}
          <div className="col-lg-8">
            <div className="card mb-4">
              <div className="card-body">
                <div className="d-flex justify-content-between align-items-start">
                  <div>
                    <h3>{project?.name}</h3>
                    <p className="text-secondary">{project?.description}</p>
                  </div>
                  <button
                    className="btn btn-primary"
                    onClick={() => navigate(`/tasks/${projectId}`)}
                  >
                    Ver Tablero
                  </button>
                </div>

                {/* Stats */}
                {stats && (
                  <div className="row g-3 mt-3">
                    <div className="col-6 col-md-3">
                      <StatsCard value={stats.totalTasks} label="Tareas" color="info" />
                    </div>
                    <div className="col-6 col-md-3">
                      <StatsCard value={stats.completedTasks} label="Completadas" color="success" />
                    </div>
                    <div className="col-6 col-md-3">
                      <StatsCard value={`${stats.completionRate || 0}%`} label="Progreso" color="primary" />
                    </div>
                    <div className="col-6 col-md-3">
                      <StatsCard value={stats.totalMembers} label="Miembros" color="warning" />
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Members Sidebar */}
          <div className="col-lg-4">
            <div className="card">
              <div className="card-body">
                <MemberList projectId={projectId} isOwner={isOwner} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ProjectDetail;
```

### 9.3 Agregar ruta

```jsx
import ProjectDetail from "../pages/ProjectDetail";

// En Routes:
<Route
  path="/projects/:projectId"
  element={
    <PrivateRoute>
      <ProjectDetail />
    </PrivateRoute>
  }
/>
```

---

## PASO 10: Panel de Administracion

### 10.1 Crear `frontend/src/pages/AdminPanel.jsx`

```jsx
import { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import client from "../api/client";
import toast from "react-hot-toast";
import Navbar from "../components/Navbar";
import LoadingSpinner from "../components/LoadingSpinner";

const AdminPanel = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState("users");
  const [users, setUsers] = useState([]);
  const [logs, setLogs] = useState([]);
  const [logStats, setLogStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user?.role !== 'admin') {
      navigate('/dashboard');
      return;
    }
    loadData();
  }, [user]);

  const loadData = async () => {
    try {
      const [usersRes, logsRes, statsRes] = await Promise.all([
        client.get("/users"),
        client.get("/logs?limit=50"),
        client.get("/logs/stats")
      ]);
      setUsers(usersRes.data);
      setLogs(logsRes.data);
      setLogStats(statsRes.data);
    } catch (error) {
      toast.error("Error al cargar datos");
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) return <LoadingSpinner />;

  return (
    <>
      <Navbar />
      <div className="container py-4">
        <h4 className="mb-4">Panel de Administracion</h4>

        {/* Tabs */}
        <ul className="nav nav-tabs mb-4">
          <li className="nav-item">
            <button
              className={`nav-link ${activeTab === 'users' ? 'active' : ''}`}
              onClick={() => setActiveTab('users')}
              style={{ background: activeTab === 'users' ? 'var(--bg-card)' : 'transparent' }}
            >
              Usuarios ({users.length})
            </button>
          </li>
          <li className="nav-item">
            <button
              className={`nav-link ${activeTab === 'logs' ? 'active' : ''}`}
              onClick={() => setActiveTab('logs')}
              style={{ background: activeTab === 'logs' ? 'var(--bg-card)' : 'transparent' }}
            >
              Logs del Sistema
            </button>
          </li>
        </ul>

        {/* Users Tab */}
        {activeTab === 'users' && (
          <div className="card">
            <div className="table-responsive">
              <table className="table table-dark mb-0">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Nombre</th>
                    <th>Email</th>
                    <th>Rol</th>
                    <th>Creado</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map(u => (
                    <tr key={u.id}>
                      <td>{u.id}</td>
                      <td>
                        <div className="d-flex align-items-center gap-2">
                          <div className="avatar avatar-sm">{u.name?.charAt(0)}</div>
                          {u.name}
                        </div>
                      </td>
                      <td>{u.email}</td>
                      <td>
                        <span className={`badge ${u.role === 'admin' ? 'bg-primary' : 'bg-secondary'}`}>
                          {u.role}
                        </span>
                      </td>
                      <td>{formatDate(u.created_at)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Logs Tab */}
        {activeTab === 'logs' && (
          <>
            {/* Log Stats */}
            {logStats && (
              <div className="row g-3 mb-4">
                <div className="col-md-4">
                  <div className="stat-card">
                    <div className="stat-value">{logStats.totalRequests}</div>
                    <div className="stat-label">Total Requests</div>
                  </div>
                </div>
                <div className="col-md-4">
                  <div className="stat-card">
                    <div className="stat-value" style={{ color: 'var(--danger)' }}>
                      {logStats.errorCount || 0}
                    </div>
                    <div className="stat-label">Errores</div>
                  </div>
                </div>
                <div className="col-md-4">
                  <div className="stat-card">
                    <div className="stat-value">
                      {logStats.avgResponseTime ? `${Math.round(logStats.avgResponseTime)}ms` : 'N/A'}
                    </div>
                    <div className="stat-label">Tiempo Promedio</div>
                  </div>
                </div>
              </div>
            )}

            {/* Logs Table */}
            <div className="card">
              <div className="table-responsive">
                <table className="table table-dark mb-0">
                  <thead>
                    <tr>
                      <th>Metodo</th>
                      <th>URL</th>
                      <th>Status</th>
                      <th>Tiempo</th>
                      <th>Usuario</th>
                      <th>Fecha</th>
                    </tr>
                  </thead>
                  <tbody>
                    {logs.map(log => (
                      <tr key={log.id}>
                        <td>
                          <span className={`badge bg-${
                            log.method === 'GET' ? 'info' :
                            log.method === 'POST' ? 'success' :
                            log.method === 'PUT' ? 'warning' :
                            log.method === 'DELETE' ? 'danger' : 'secondary'
                          }`}>
                            {log.method}
                          </span>
                        </td>
                        <td style={{ maxWidth: '200px', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                          {log.url}
                        </td>
                        <td>
                          <span className={log.status_code >= 400 ? 'text-danger' : 'text-success'}>
                            {log.status_code}
                          </span>
                        </td>
                        <td>{log.response_time}ms</td>
                        <td>{log.user_id || '-'}</td>
                        <td>{formatDate(log.created_at)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}
      </div>
    </>
  );
};

export default AdminPanel;
```

### 10.2 Agregar ruta

```jsx
import AdminPanel from "../pages/AdminPanel";

// En Routes:
<Route
  path="/admin"
  element={
    <PrivateRoute>
      <AdminPanel />
    </PrivateRoute>
  }
/>
```

---

## PASO 11: AppRouter Final

### 11.1 `frontend/src/routes/AppRouter.jsx` completo

```jsx
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "../pages/Login";
import Register from "../pages/Register";
import Dashboard from "../pages/Dashboard";
import Tasks from "../pages/Tasks";
import MyTasks from "../pages/MyTasks";
import ProjectDetail from "../pages/ProjectDetail";
import AdminPanel from "../pages/AdminPanel";
import PrivateRoute from "./PrivateRoute";

const AppRouter = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Protected Routes */}
        <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          }
        />
        <Route
          path="/projects/:projectId"
          element={
            <PrivateRoute>
              <ProjectDetail />
            </PrivateRoute>
          }
        />
        <Route
          path="/tasks/:projectId"
          element={
            <PrivateRoute>
              <Tasks />
            </PrivateRoute>
          }
        />
        <Route
          path="/my-tasks"
          element={
            <PrivateRoute>
              <MyTasks />
            </PrivateRoute>
          }
        />
        <Route
          path="/admin"
          element={
            <PrivateRoute>
              <AdminPanel />
            </PrivateRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
};

export default AppRouter;
```

---

## Resumen de Archivos Creados/Modificados

### Archivos Nuevos:
- `src/components/LoadingSpinner.jsx`
- `src/components/StatsCard.jsx`
- `src/components/TaskCard.jsx`
- `src/components/Modal.jsx`
- `src/components/KanbanBoard.jsx`
- `src/components/CommentSection.jsx`
- `src/components/MemberList.jsx`
- `src/pages/Register.jsx`
- `src/pages/MyTasks.jsx`
- `src/pages/ProjectDetail.jsx`
- `src/pages/AdminPanel.jsx`

### Archivos Modificados:
- `src/styles/custom.css` - Estilos completos
- `src/App.jsx` - Toast notifications
- `src/routes/AppRouter.jsx` - Todas las rutas
- `src/pages/Login.jsx` - Mejorado con toast
- `src/pages/Dashboard.jsx` - Stats y tabs
- `src/pages/Tasks.jsx` - Kanban board
- `src/components/Navbar.jsx` - Links y avatar

### Dependencias:
```bash
npm install @hello-pangea/dnd react-hot-toast
```

---

## Credenciales de Prueba

```
Admin: miguel@devteam.com / password123
User:  ana@devteam.com / password123
```

---

## Siguiente Paso

Despues de implementar todo esto, puedes continuar con:
- Agregar animaciones con Framer Motion
- Implementar modo oscuro/claro toggle
- Agregar notificaciones en tiempo real con WebSockets
- Crear graficos con Chart.js para las estadisticas
