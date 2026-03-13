const express = require("express");

const app = express();

const PORT = 3000;

const projects = [
  {
    id: 1,
    name: "Website Redesign",
    status: "active"
  },
  {
    id: 2,
    name: "Mobile App",
    status: "planning"
  }
];

app.get("/", (req, res) => {
    res.send("Project Manager API");
});

app.get("/api", (req, res) => {
    res.json({
        name: "Project Manager API",
        version: "1.0",
        status: "running"
    });
});

app.get("/api/projects", (req, res) => {
  res.json(projects);
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});