const sqlite3 = require("sqlite3")
const { open } = require("sqlite")

async function connectDB() {
    return open({
        filename: "./database.sqlite",
        driver: sqlite3.Database
    })
}

async function initDB() {
    const db = await connectDB()

    await db.exec(`
            CREATE TABLE IF NOT EXISTS projects (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                name TEXT NOT NULL,
                description TEXT,
                status TEXT,
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP
            );

            CREATE TABLE IF NOT EXISTS users (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                name TEXT,
                email TEXT UNIQUE,
                password TEXT,
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP
            );
        `)
    
    return db
}

//module.exports = connectDB
//module.exports = initDB

module.exports = {
    connectDB,
    initDB
}