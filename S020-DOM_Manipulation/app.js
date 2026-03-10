// Seleccionar los elementos que queremos manipular
const taskInput = document.getElementById("taskInput")
const addTaskBtn = document.getElementById("addTaskBtn")
const taskList = document.getElementById("taskList")

const totalCount = document.getElementById("totalCount")
const completedCount = document.getElementById("completedCount")
const pendingCount = document.getElementById("pendingCount")

// manipular los elementos del DOM
function addTask() {
    const taskText = taskInput.value.trim()

    if (!taskText) return

    const li = document.createElement("li")
    li.textContent = taskText

    const deleteBtn = document.createElement("button")
    deleteBtn.textContent = "Delete"
    deleteBtn.classList.add("delete-btn")

    li.appendChild(deleteBtn)
    taskList.appendChild(li)

    taskInput.value = ""
}

// agregar los event listener
addTaskBtn.addEventListener("click", addTask)

// event delegation
taskList.addEventListener("click", (e) => {

    const li = e.target.closest("li")

    if (!li) return

    if (e.target.classList.contains("delete-btn")) {
        li.remove()
    } else {
        li.classList.toggle("completed")
    }
})