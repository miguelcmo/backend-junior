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