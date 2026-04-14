import { Droppable, Draggable } from "@hello-pangea/dnd"

const KanbanColumn = ({ id, title, tasks }) => {
    return (
        <div className="col-md-3">
            <h5 className="text-center">{title}</h5>
            <Droppable droppableId={id}>
                {(provided) => (
                    <div
                        ref={provided.innerRef}
                        {...provided.droppableProps}
                        className="p-2"
                        style={{
                            minHeight: "300px",
                            background: "rgba(255,255,255,0.05)",
                            borderRadius: "10px"
                        }}
                    >
                        {tasks.map((task, index) => (
                            <Draggable
                                key={task.id}
                                draggableId={task.id.toString()}
                                index={index}
                            >
                                {(provided) => (
                                    <div
                                        className="card card-custom p-2 mb-2"
                                        ref={provided.innerRef}
                                        {...provided.draggableProps}
                                        {...provided.dragHandleProps}
                                    >
                                        <h6>{task.title}</h6>
                                        <p>{task.description}</p>
                                        <p className={task.status}>{task.status}</p>
                                    </div>
                                )}
                            </Draggable>
                        ))}
                        {provided.placeholder}
                    </div> 
                )}
            </Droppable>
        </div>
    )
}

export default KanbanColumn