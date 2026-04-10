const getAllProjects = async (db) => {
    return db.all("SELECT * FROM projects")
}

const getProjectById = async (db, id) => {
    return db.get(
        "SELECT * FROM projects WHERE id = ?",
        [id]
    )
}

const createProject = async (db, data, ownerId) => {
    const { name, description, status } = data

    const result = await db.run(
        "INSERT INTO projects (name, description, status, owner_id) VALUES (?, ?, ?, ?)",
        [name, description, status, ownerId]
    )

    return {
        id: result.lastID,
        name,
        description,
        status,
        owner_id: ownerId
    }
}

const updateProject = async (db, id, data) => {
    const { name, description, status } = data

    await db.run(
        "UPDATE projects SET name = ?, description = ?, status = ? WHERE id = ?",
        [name, description, status, id]
    )

    return {
        id,
        name,
        description,
        status
    }
}

const deleteProject = async (db, id) => {
    const project = await db.get(
        "SELECT * FROM projects WHERE id = ?",
        [id]
    )

    await db.run(
        "DELETE FROM projects WHERE id = ?",
        [id]
    )

    return project
}

module.exports = {
    getAllProjects,
    getProjectById,
    createProject,
    updateProject,
    deleteProject
}