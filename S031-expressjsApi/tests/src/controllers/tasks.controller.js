let tasks = [
  {
    id: 1,
    title: "Create API",
    project_id: 1,
    status: "todo"
  },
  {
    id: 2,
    title: "Design database",
    project_id: 1,
    status: "in_progress"
  }
];

const getTasksByProject = (req, res) => {

  const projectId = parseInt(req.params.projectId);

  const projectTasks = tasks.filter(
    task => task.project_id === projectId
  );

  res.json(projectTasks);

};

const createTask = (req, res) => {

  const projectId = parseInt(req.params.projectId);

  const { title, status } = req.body;

  const newTask = {
    id: tasks.length + 1,
    title,
    status,
    project_id: projectId
  };

  tasks.push(newTask);

  res.status(201).json(newTask);

};

const getTaskById = (req, res) => {

  const id = parseInt(req.params.id);

  const task = tasks.find(t => t.id === id);

  if (!task) {
    return res.status(404).json({
      message: "Task not found"
    });
  }

  res.json(task);

};

const updateTask = (req, res) => {

  const id = parseInt(req.params.id);

  const task = tasks.find(t => t.id === id);

  if (!task) {
    return res.status(404).json({
      message: "Task not found"
    });
  }

  const { title, status } = req.body;

  task.title = title || task.title;
  task.status = status || task.status;

  res.json(task);

};

const deleteTask = (req, res) => {

  const id = parseInt(req.params.id);

  const index = tasks.findIndex(t => t.id === id);

  if (index === -1) {
    return res.status(404).json({
      message: "Task not found"
    });
  }

  const deleted = tasks.splice(index, 1);

  res.json({
    message: "Task deleted",
    task: deleted[0]
  });

};

module.exports = {
  getTasksByProject,
  createTask,
  getTaskById,
  updateTask,
  deleteTask
};