const swaggerJsdoc = require("swagger-jsdoc");

const options = {

  definition: {

    openapi: "3.0.0",

    info: {
      title: "Project Manager API",
      version: "1.0.0",
      description: "API para gestión de proyectos y tareas"
    },

    servers: [
      {
        url: "http://localhost:3000/api"
      }
    ]

  },

  apis: ["./src/routes/*.js", "./src/auth/*.js"]

};

const swaggerSpec = swaggerJsdoc(options);

module.exports = swaggerSpec;