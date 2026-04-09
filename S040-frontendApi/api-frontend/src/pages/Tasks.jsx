import Navbar from "../components/Navbar"
import { useParams } from "react-router-dom"
import { useEffect, useState } from "react"
import client from "../api/client"

const Tasks = () => {
    const { projectId } = useParams()
    const [tasks, setTasks] = useState([])
    const [title, setTitle] = useState("")
    const [description, setDescription] = useState("")

    const handleCreateTask = async () => {
        await client.post(`/projects/${projectId}/tasks`, {
            title,
            description,
            status: "todo"
        })
        window.location.reload()
    }

    useEffect(() => {
        const fetchTasks = async () => {
            const res = await client.get(`/projects/${projectId}/tasks`)
            setTasks(res.data)
        }
        fetchTasks()
    }, [projectId])

    return (
        <div className="container">
            <Navbar />
            <div className="mt-4">
                <h2>Tareas</h2>

                <div className="p-3 mb-3">
                    <input
                        className="form-control mb-2"
                        placeholder="Nueva tarea"
                        onChange={(e) => setTitle(e.target.value)}
                    />
                    <input
                        className="form-control mb-2"
                        placeholder="Agrega una descripción a la tarea"
                        onChange={(e) => setDescription(e.target.value)}
                    />
                    <button
                        className="btn btn-primary"
                        onClick={handleCreateTask}
                    >
                        Crear nueva tarea
                    </button>
                </div>

                {tasks.map(task => (
                    <div className="card p-3 mb-2" key={task.id}>
                        <h5>{task.title}</h5>
                        <p>{task.description}</p>
                        <span>{task.status}</span>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default Tasks