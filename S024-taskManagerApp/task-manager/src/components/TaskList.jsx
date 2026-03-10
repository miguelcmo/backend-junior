import { useState } from "react" // useState es el hook de react mas usado, este hook maneja el estado de un componente
import TaskItem from "./TaskItem"

const apiQuery = [
    {id: 1, text: "Aprender React", completed: false},
    {id: 2, text: "Estudiar Python", completed: false},
    {id: 3, text: "Aprender Next.js", completed: false},
    {id: 4, text: "Aprender CSS", completed: false}
]

function TaskList ({ name }) {
    // const [estado, establecerEstado] = useState(estadoInicial)
    const [tasks, setTasks] = useState(apiQuery)
    const [count, setCount] = useState(0)
    const [newTask, setNewTask] = useState("")
    const [filter, setFilter] = useState("all")

    const handleChange = (e) => {
        setNewTask(e.target.value)
    }

    const handleSubmit = (e) => {
        e.preventDefault()

        if (newTask.trim() === "") return

        const task = {
            id: Date.now(),
            text: newTask
        }

        setTasks([...tasks, task])
        setNewTask("")
    }

    const addTask = () => {
        const newTask = {
            id: Date.now(),
            text: "Nueva tarea dummy"
        }

        setTasks([...tasks, newTask]) // setTasks le dice al componente que el estado fue actualizado
    }

    const updateCount = () => {
        setCount(count + 1)
    }

    const toogleTask = (id) => {
        const updatedTask = tasks.map((task) => 
            task.id === id ? {...task, completed: !task.completed} : task
        )
        setTasks(updatedTask)
    }

    const filteredTasks = tasks.filter((task) => {
        if (filter === "completed") return task.completed
        if (filter === "pending") return !task.completed
        return true
    })

    return (
        <>
            <h2>Lista: { name }</h2>
            <ul className="task-list">
                <button onClick={addTask}>Agregar tarea dummy</button>
                <button onClick={updateCount}>Contador: {count}</button>

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
                {filteredTasks.map((task) => (
                    <TaskItem 
                        key={task.id}
                        task={task}
                        toogleTask={toogleTask}
                    />
                ))}

            </ul>
        </>
    )
}

export default TaskList