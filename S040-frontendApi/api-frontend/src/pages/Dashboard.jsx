import Navbar from "../components/Navbar"
import { useEffect, useState } from "react"
import client from "../api/client"

const Dashboard = () => {
    const [projects, setProjects] = useState([])
    const [name, setName] = useState("")
    const [description, setDescription] = useState("")

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
                        </div>
                    </div> 
                ))}
            </div>
        </div>
    )
}

export default Dashboard