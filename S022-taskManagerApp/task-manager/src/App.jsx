import Header from "./components/Header"
import TaskList from "./components/TaskList"
import "./App.css"

function App() {
  return (
    <div className="container">
      <Header title="Titulo de mi aplicación" />
      <TaskList name="Tareas principales" />
    </div>
  )
}

export default App
