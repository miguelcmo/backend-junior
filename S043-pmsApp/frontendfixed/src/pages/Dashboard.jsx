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
  const [debugLog, setDebugLog] = useState(["Iniciando..."]);

  const addLog = (msg) => {
    setDebugLog(prev => [...prev, `${new Date().toLocaleTimeString()}: ${msg}`]);
  };

  useEffect(() => {
    addLog("useEffect ejecutado");
    loadData();
  }, []);

  const loadData = async () => {
    addLog("Iniciando carga...");
    try {
      addLog("Llamando GET /projects...");
      const projectsRes = await client.get("/projects");
      addLog(`Respuesta recibida: ${JSON.stringify(projectsRes.data).substring(0, 100)}`);

      if (Array.isArray(projectsRes.data)) {
        setProjects(projectsRes.data);
        addLog(`OK: ${projectsRes.data.length} proyectos cargados`);
      } else {
        addLog(`ERROR: data no es array, es ${typeof projectsRes.data}`);
        setProjects([]);
      }

      // Cargar stats y mis proyectos
      const [statsRes, myProjectsRes] = await Promise.allSettled([
        client.get("/stats"),
        client.get("/me/projects")
      ]);

      if (statsRes.status === 'fulfilled') {
        setStats(statsRes.value.data);
        addLog("Stats cargados OK");
      } else {
        addLog(`Stats error: ${statsRes.reason?.message}`);
      }

      if (myProjectsRes.status === 'fulfilled') {
        setMyProjects(myProjectsRes.value.data);
        addLog(`Mis proyectos: ${myProjectsRes.value.data.length}`);
      } else {
        addLog(`Mis proyectos error: ${myProjectsRes.reason?.message}`);
      }
    } catch (error) {
      addLog(`ERROR: ${error.message}`);
      toast.error("Error al cargar proyectos");
    } finally {
      addLog("Carga finalizada");
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

        {/* Debug info - remover despues */}
        <div className="alert alert-dark mb-3" style={{fontSize: '0.75rem', maxHeight: '150px', overflow: 'auto'}}>
          <strong>DEBUG LOG:</strong>
          {debugLog.map((log, i) => <div key={i}>{log}</div>)}
          <hr className="my-1" />
          projects.length={projects.length}, myProjects.length={myProjects.length}, displayProjects.length={displayProjects.length}
        </div>

        {/* Projects Grid */}
        {displayProjects.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon">📁</div>
            <p>No hay proyectos (displayProjects vacío)</p>
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
                        className="btn btn-sm btn-outline-light"
                        onClick={() => navigate(`/projects/${project.id}`)}
                        title="Ver detalles y miembros"
                      >
                        ⚙️
                      </button>
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