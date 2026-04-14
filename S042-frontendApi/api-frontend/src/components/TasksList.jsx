const TasksList = ({ tasks }) => {
    return (
        <div className="row">
            {tasks.map(task => (
                <div className="col-md-4" key={task.id}>
                    <div className="card card-custom p-3 mb-3">
                        <h6>{task.title}</h6>
                        <p>{task.description}</p>
                        <span className={task.status}>{task.status}</span>
                    </div>
                </div>
            ))}
        </div>
    )
}

export default TasksList