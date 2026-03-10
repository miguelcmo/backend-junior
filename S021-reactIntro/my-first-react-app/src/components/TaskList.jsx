import TaskItem from "./TaskItem"

function TaskList() {
  return (
    <div className="task-list">
      <TaskItem text="Aprender React" />
      <TaskItem text="Practicar JSX" />
    </div>
  )
}

export default TaskList