import { useState } from "react" // useState es el hook de react mas usado, este hook maneja el estado de un componente
import { useTasks } from "../hooks/useTasks"
import TaskItem from "./TaskItem"

function TaskList ({ name }) {
    // const [estado, establecerEstado] = useState(estadoInicial)
    // const [tasks, setTasks] = useState(apiQuery)
    // const [count, setCount] = useState(0)
    //const [filter, setFilter] = useState("all")
    const { tasks, addTask, toggleTask, setFilter } = useTasks()
    const [newTask, setNewTask] = useState("")

    const handleChange = (e) => {
        setNewTask(e.target.value)
    }
    
    const handleSubmit = (e) => {
        e.preventDefault()
        addTask(newTask)
        setNewTask("")
    }

    // const handleSubmit = (e) => {
    //     e.preventDefault()

    //     if (newTask.trim() === "") return

    //     const task = {
    //         id: Date.now(),
    //         text: newTask
    //     }

    //     setTasks([...tasks, task])
    //     setNewTask("")
    // }

    // Se traslado el custom hooks useTasks
    // const addTask = () => {
    //     const newTask = {
    //         id: Date.now(),
    //         text: "Nueva tarea dummy"
    //     }

    //     setTasks([...tasks, newTask]) // setTasks le dice al componente que el estado fue actualizado
    // }

    // no hace parte de la app tasklist
    // const updateCount = () => {
    //     setCount(count + 1)
    // }

    // Se traslado al custom hooks useTasks
    // const toggleTask = (id) => {
    //     const updatedTask = tasks.map((task) => 
    //         task.id === id ? {...task, completed: !task.completed} : task
    //     )
    //     setTasks(updatedTask)
    // }

    // Se traslado al custom hooks useTasks
    // const filteredTasks = tasks.filter((task) => {
    //     if (filter === "completed") return task.completed
    //     if (filter === "pending") return !task.completed
    //     return true
    // })

    return (
        <>
            <h2>Lista: { name }</h2>
            <ul className="task-list">
                {/* <button onClick={addTask}>Agregar tarea dummy</button> */}
                {/* <button onClick={updateCount}>Contador: {count}</button> */}

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
                    <TaskItem text={task.text} />
                ))} */}
                {/* {filteredTasks.map((task) => (
                    <TaskItem 
                        key={task.id}
                        task={task}
                        toogleTask={toogleTask}
                    />
                ))} */}
                {tasks.map((task) => (
                    <TaskItem
                        key={task.id}
                        task={task}
                        toggleTask={toggleTask}
                    />
                ))}
            </ul>
        </>
    )
}

export default TaskList