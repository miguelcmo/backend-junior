// const express = require("express")

// const app = express()

// app.use(express.json())

// // const initDB = require("./database/db");

// // let db;

// // initDB().then(database => {

// //   db = database;

// //   console.log("Database ready");

// // });

// const connectDB = require("./database/db");

// let db;

// connectDB().then(database => {
//   db = database;
//   console.log("Database connected");
// });


// // Ejecutar el middleware antes de las rutas
// const logger = require("./middleware/logger")
// app.use(logger)

// // uso de rutas de proyectos
// const projectRoutes = require("./routes/projects.routes")
// app.use("/api/projects", projectRoutes)

// // uso de rutas de tereas
// const taskRoutes = require("./routes/tasks.routes")
// app.use("/api", taskRoutes)

// // manejo de errores depues de ejecutar toda nuestra aplicacion
// const errorHandler = require("./middleware/errorHandler")
// app.use(errorHandler)

// app.locals.db = db;


// const PORT = 3000

// app.listen(PORT, () => {
//     console.log(`Server running on http://localhost:${PORT}`)
// })

const express = require("express")
const app = express()

app.use(express.json())

const initDB = require("./database/db");

// middlewares
const logger = require("./middleware/logger")
app.use(logger)

// rutas
const projectRoutes = require("./routes/projects.routes")
app.use("/api/projects", projectRoutes)

const taskRoutes = require("./routes/tasks.routes")
app.use("/api", taskRoutes)

// error handler
const errorHandler = require("./middleware/errorHandler")
app.use(errorHandler)

const PORT = 3000

// 🔥 levantar server SOLO cuando la DB esté lista
initDB().then(database => {

  app.locals.db = database;

  console.log("Database ready");

  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`)
  });

}).catch(err => {
  console.error("Error connecting DB:", err);
});