import Header from "./components/Header"
import TaskList from "./components/TaskList"
import "./App.css"

function App() {
  return (
    <div className="container">
      <Header title="Task Manager Básico" />
      <TaskList />
    </div>
  )
}

export default App