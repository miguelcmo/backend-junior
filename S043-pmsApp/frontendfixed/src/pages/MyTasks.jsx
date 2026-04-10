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