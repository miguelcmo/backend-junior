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