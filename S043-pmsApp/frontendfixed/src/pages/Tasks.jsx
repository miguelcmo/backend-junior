import { useState, useEffect, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import client from "../api/client";
import toast from "react-hot-toast";
import Navbar from "../components/Navbar";
import KanbanBoard from "../components/KanbanBoard";
import LoadingSpinner from "../components/LoadingSpinner";
import Modal from "../components/Modal";
import CommentSection from "../components/CommentSection";

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
          <div className="d-flex gap-2">
            <button
              className="btn btn-outline-light"
              onClick={() => navigate(`/projects/${projectId}`)}
              title="Ver detalles y miembros"
            >
              ⚙️ Miembros
            </button>
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
          {selectedTask && (
  <CommentSection taskId={selectedTask.id} />
)}
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