import Navbar from "../components/Navbar";
import { useEffect, useState } from "react";
import client from "../api/client";

const Dashboard = () => {
    const [projects, setProjects] = useState([]);

    useEffect(() => {

  const fetchProjects = async () => {

    try {
      const res = await client.get("/projects");
      setProjects(res.data);
    } catch (error) {
      console.error(error);
    }

  };

  fetchProjects();

}, []);

  return (
    <div>

      <Navbar />

      <div className="container mt-4">

        <h2>Dashboard</h2>

        <p>Bienvenido a tu aplicación 🚀</p>

        <div className="row">

  {projects.map(project => (

    <div className="col-md-4" key={project.id}>
      
      <div className="card card-custom p-3 mb-3">
        
        <h5>{project.name}</h5>
        <p>{project.description}</p>

      </div>

    </div>

  ))}

</div>

      </div>

    </div>
  );
};

export default Dashboard;