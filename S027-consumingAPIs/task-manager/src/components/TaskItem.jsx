// import "./TaskItem.css"

// function TaskItem ({ task, toggleTask }) {
//     return (
//         <div
//             className={`task-item ${task.completed ? "completed" : ""}`}
//             onClick={() => toggleTask(task.id)}
//         >
//             <p>{task.text}</p>
//         </div>
//     )
// }

// export default TaskItem

function TaskItem ({ task, toggleTask}) {
    return (
        <div className="task-item" onClick={() => toggleTask(task.id)}>
            <div className="task-header">
                <span className="task-emoji">{task.emoji}</span>
                <h3>{task.title}</h3>
            </div>
            <p className="task-description">{task.description}</p>
            <div className="task-meta">
                <span className={`priority ${task.priority}`}>Priority: {task.priority}</span>
                <span className={`status ${task.status}`}>Status: {task.status}</span>
            </div>
        </div>
    )
}

export default TaskItem

