import { useState, useEffect } from "react"

export function useTasks() {
    // estados tareas - tasks y filtros
    // const [tasks, setTasks] = useState([
    //     {id: 1, text: "Aprender React", completed: false},
    //     {id: 2, text: "Estudiar Python", completed: false},
    //     {id: 3, text: "Aprender Next.js", completed: false},
    //     {id: 4, text: "Aprender CSS", completed: false}
    // ])
    const [tasks, setTasks] = useState([])
    const [filter, setFilter] = useState("all")
    const [loading, setLoading] = useState(true)

    const API_URL = "https://tasklistapi.vercel.app/tasks"

    useEffect(() => {
        async function startFetch() {
            setLoading(true)

            const response = await fetch(API_URL, {
                headers: {
                    Authorization: "Bearer react-students-token"
                }
            })

            const data = await response.json()

            // const formattedTasks = data.map(task => ({
            //     id: task.id,
            //     text: task.title,
            //     completed: false
            // }))
            const formattedTasks = data.map(task => ({
                id: task.id,
                title: task.title,
                description: task.description,
                status: task.status,
                priority: task.priority,
                emoji: task.emoji
            }))

            if(!ignore)
                setTasks(formattedTasks)
                setLoading(false)
        }

        let ignore = false

        startFetch()

        return () => {ignore = true}
        
    }, [])
    
    // agregar la tarea al estado
    const addTask = (text) => {
        if(text.trim() === "") return
        const newTask = {
            id: Date.now(),
            text,
            completed: false
        }
        setTasks([...tasks, newTask]) // setTasks le dice al componente que el estado fue actualizado
    }

    // switchear el estado de la tarea
    const toggleTask = (id) => {
        const updatedTask = tasks.map((task) => 
            task.id === id ? {...task, completed: !task.completed} : task
        )
        setTasks(updatedTask)
    }

    // filtrar tareas
    const filteredTasks = tasks.filter((task) => {
        if (filter === "completed") return task.completed
        if (filter === "pending") return !task.completed
        return true
    })

    return {
        tasks: filteredTasks, // lista de tareas
        addTask, // funcion
        toggleTask, // funcion
        filter, // estado del filtro
        setFilter, // funcion de actualizacion del filtro
        loading
    }
}