import { useState, useEffect } from "react"

export function useTasks() {

  // const [tasks, setTasks] = useState([
  //   { id: 1, text: "Aprender React", completed: false },
  //   { id: 2, text: "Practicar JSX", completed: false }
  // ])

  const [tasks, setTasks] = useState([])
  const [filter, setFilter] = useState("all")
  const [loading, setLoading] = useState(true)

 const API_URL = "https://tasklistapi.vercel.app/tasks"

  useEffect(() => {

    async function startFetching() {

      setLoading(true)

      const response = await fetch(API_URL, {
        headers: {
          Authorization: "Bearer react-students-token"
        }
      })

      const data = await response.json()

      // const formattedTasks = data.map(task => ({
      //   id: task.id,
      //   text: task.title,
      //   completed: task.completed
      // }))
      const formattedTasks = data.map(task => ({
        id: task.id,
        title: task.title,
        description: task.description,
        status: task.status,
        priority: task.priority,
        emoji: task.emoji
      }))

      if (!ignore) {
        setTasks(formattedTasks)
        setLoading(false)
      }
    }

    let ignore = false

    startFetching()

    return () => {
      ignore = true
    }

  }, [])

  const addTask = (text) => {
    if (text.trim() === "") return

    const newTask = {
      id: Date.now(),
      text,
      completed: false
    }

    setTasks([...tasks, newTask])
  }

  const toggleTask = (id) => {
    const updated = tasks.map(task =>
      task.id === id
        ? { ...task, completed: !task.completed }
        : task
    )

    setTasks(updated)
  }

  const filteredTasks = tasks.filter(task => {
    if (filter === "completed") return task.completed
    if (filter === "pending") return !task.completed
    return true
  })

  return {
    tasks: filteredTasks,
    addTask,
    toggleTask,
    filter,
    setFilter,
    loading
  }
}