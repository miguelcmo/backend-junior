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