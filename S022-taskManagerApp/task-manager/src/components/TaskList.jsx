import TaskItem from "./TaskItem"
function TaskList ({ name }) {
    return (
        <>
            <h2>Lista: { name }</h2>
            <ul className="task-list">
                <TaskItem text="Estudiar REACT"/>
                <TaskItem text="Estudiar Python"/>
                <TaskItem text="Estudiar Go" />
            </ul>
        </>
    )
}

export default TaskList