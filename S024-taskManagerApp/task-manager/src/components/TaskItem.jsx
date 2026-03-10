import "./TaskItem.css"

function TaskItem ({ task, toogleTask }) {
    return (
        <div
            className={`task-item ${task.completed ? "completed" : ""}`}
            onClick={() => toogleTask(task.id)}
        >
            <p>{task.text}</p>
        </div>
    )
}

export default TaskItem

