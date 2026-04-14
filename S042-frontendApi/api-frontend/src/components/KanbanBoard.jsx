import { DragDropContext } from "@hello-pangea/dnd"
import KanbanColumn from "./KanbanColumn"
import client from "../api/client"

const KanbanBoard = ({ tasks, setTasks }) => {
    const columns = {
        todo: tasks.filter(t => t.status === "todo"),
        in_progress: tasks.filter(t => t.status === "in_progress"),
        done: tasks.filter(t => t.status === "done"),
        pending: tasks.filter(t => t.status === "pending")
    }

    // const handleDragEnd = async (result) => {
    //     const { destination, draggableId } = result
    //     if (!destination) return
    //     const newStatus = destination.droppableId

    //     try {
    //         await client.put(`/tasks/${draggableId}`, {
    //             status: newStatus
    //         })
    //     } catch (err) {
    //         console.error(err)
    //     }
    // }

    const handleDragEnd = async (result) => {
        const { destination, draggableId } = result
        if(!destination) return

        const newStatus = destination.droppableId

        try {
            await client.put(`/tasks/${draggableId}`, {
                status: newStatus
            })

            const updatedTasks = tasks.map(task => 
                task.id === parseInt(draggableId)
                    ? {...task, status:newStatus}
                    : task
            )
            setTasks(updatedTasks)
        } catch (err) {
            console.error(err)
        }
    }

    return (
        <DragDropContext onDragEnd={handleDragEnd}>
            <div className="row">
                <KanbanColumn id="todo" title="To Do" tasks={columns.todo} />
                <KanbanColumn id="in_progress" title="In Progress" tasks={columns.in_progress} />
                <KanbanColumn id="done" title="Done" tasks={columns.done} />
                <KanbanColumn id="pending" title="Pending" tasks={columns.pending} />
            </div>
        </DragDropContext>
    )
}

export default KanbanBoard