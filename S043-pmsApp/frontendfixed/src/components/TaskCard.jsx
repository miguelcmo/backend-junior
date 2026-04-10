const TaskCard = ({ task, onClick, showProject = false }) => {
  const getPriorityClass = (priority) => {
    return `badge priority-${priority || 'medium'}`;
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