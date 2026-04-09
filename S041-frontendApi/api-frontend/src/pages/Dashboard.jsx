import Navbar from "../components/Navbar"
import { useEffect, useState } from "react"
import client from "../api/client"
import { useNavigate } from "react-router-dom"

const Dashboard = () => {
    const [projects, setProjects] = useState([])
    const [name, setName] = useState("")
    const [description, setDescription] = useState("")
    const navigate = useNavigate()

    const handleCreate = async () => {
        try {
            //await client.post("/projects", {
            const res = await client.post("/projects", {
                name,
                description
            })

            // Agregar el nuevo proyecto al estado sin recargar la página
            setProjects([...projects, res.data])
            setName("")
            setDescription("")

            //alert("Proyecto creado!")
            
            //window.location.reload()

        } catch (err) {
            alert("Error: " + err)
        }
    }

    const handleDelete = async(id) => {
        try {
            await client.delete(`/projects/${id}`)
            //window.location.reload()
            setProjects(projects.filter(project => project.id !== id))
        } catch (error) {
            alert("No autorizado - " + error)
        }
    }

    useEffect (() => {
        const fetchProjects = async () => {
            try {
                const res = await client.get("/projects")
                setProjects(res.data)
            } catch (err) {
                console.error(err)
            }
        }
        fetchProjects()
    }, [])

    return (
        <div className="container">
            <Navbar />

            <div className="mt-4">
                <h2>Dashboard</h2>
                <p>Bienvenido el sistema de gestión de proyectos</p>
            </div>

            <div className="card-custom p-3 mb-3">
                <h5>Nuevo Proyecto</h5>
                <input 
                    className="form-control mb-2"
                    placeholder="Nombre"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                />
                <input 
                    className="form-control mb-2"
                    placeholder="Descripción"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                />
                <button
                    className="btn btn-primary"
                    onClick={handleCreate}
                >Crear Proyecto</button>
            </div>

            <div className="row">
                {projects.map(project => (
                    <div className="col-md-4" key={project.id}>
                        <div className="card p-3 mb-3">
                            <h5>{project.name}</h5>
                            <p>{project.description}</p>
                            <button
                                className="btn btn-outline-secondary mt-2"
                                onClick={() => navigate(`/tasks/${project.id}`)}
                            >
                                Ver Tareas
                            </button>
                            <button
                                className="btn btn-danger mt-2"
                                onClick={() => handleDelete(project.id)}
                            >
                                Eliminar
                            </button>
                        </div>
                    </div> 
                ))}
            </div>
        </div>
    )
}

export default Dashboard