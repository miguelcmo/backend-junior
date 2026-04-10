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