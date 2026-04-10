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