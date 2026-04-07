import Navbar from "../components/Navbar"
import { useParams } from "react-router-dom"
import { useEffect, useState } from "react"
import client from "../api/client"



const Tasks = () => {
    const { projectId } = useParams()
    const [tasks, setTasks] = useState([])
    const [title, setTitle] = useState("")

    const handleCreateTask = async () => {

  await client.post(`/projects/${projectId}/tasks`, {
    title,
    status: "todo"
  });

  window.location.reload();

};

    useEffect(() => {

  const fetchTasks = async () => {
    const res = await client.get(`/projects/${projectId}/tasks`);
    setTasks(res.data);
  };

  fetchTasks();

}, [projectId]);

  return (
    <div className="container">
      <Navbar />
      <input
  className="form-control mb-2"
  placeholder="Nueva tarea"
  onChange={(e) => setTitle(e.target.value)}
/>

<button onClick={handleCreateTask} className="btn btn-primary">
  Crear
</button>
      <div className="mt-4">
        <h2>Tareas</h2>
        {tasks.map(task => (
  <div className="card card-custom p-3 mb-2" key={task.id}>
    <h6>{task.title}</h6>
    <span>{task.status}</span>
  </div>
))}
      </div>
    </div>
  );
};

export default Tasks;