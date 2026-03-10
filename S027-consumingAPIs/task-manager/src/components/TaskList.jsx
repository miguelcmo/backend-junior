import { useState } from "react" // useState es el hook de react mas usado, este hook maneja el estado de un componente
import { useTasks } from "../hooks/useTasks"
import TaskItem from "./TaskItem"

function TaskList ({ name }) {
    // custom hook y la nueva tarea
    const { tasks, addTask, toggleTask, setFilter, loading } = useTasks()
    const [newTask, setNewTask] = useState("")

    // manejo del input
    const handleChange = (e) => {
        setNewTask(e.target.value)
    }
    // manejo del formulario
    const handleSubmit = (e) => {
        e.preventDefault()
        addTask(newTask)
        setNewTask("")
    }

    // elemento JSX
    return (
        <>
            <h2>Lista: { name }</h2>
            <ul className="task-list">
                <form onSubmit={handleSubmit}>
                    <input 
                        type="text" 
                        placeholder="Escriba una tarea..."
                        value={newTask}
                        onChange={handleChange}
                    />
                    <button type="submit">Agregar</button>
                </form>
                <div className="filters">
                    <button onClick={() => setFilter("all")}>Todas</button>
                    <button onClick={() => setFilter("completed")}>Completadas</button>
                    <button onClick={() => setFilter("pending")}>Pendientes</button>
                </div>
                {/* {tasks.map((task) => (
                    <TaskItem
                        key={task.id}
                        task={task}
                        toggleTask={toggleTask}
                    />
                ))} */}
                {loading ? (
                    <p>Cargando tareas...</p>
                ) : (
                    tasks.map(task => (
                        <TaskItem
                            key={task.id}
                            task={task}
                            toggleTask={toggleTask}
                        />
                    ))
                )}
            </ul>
        </>
    )
}

export default TaskList