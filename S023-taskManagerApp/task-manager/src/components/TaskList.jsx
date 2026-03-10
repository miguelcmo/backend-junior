import { useState } from "react" // useState es el hook de react mas usado, este hook maneja el estado de un componente
import TaskItem from "./TaskItem"

const apiQuery = [
    {id: 1, text: "Aprender React"},
    {id: 2, text: "Estudiar Python"},
    {id: 3, text: "Aprender Next.js"},
    {id: 4, text: "Aprender CSS"}
]

function TaskList ({ name }) {
    // const [estado, establecerEstado] = useState(estadoInicial)
    const [tasks, setTasks] = useState(apiQuery)
    const [count, setCount] = useState(0)

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

    return (
        <>
            <h2>Lista: { name }</h2>
            <ul className="task-list">
                <button onClick={addTask}>Agregar tarea dummy</button>

                <button onClick={updateCount}>Contador: {count}</button>
                
                {tasks.map((task) => (
                    <TaskItem text={task.text} />
                ))}
            </ul>
        </>
    )
}

export default TaskList