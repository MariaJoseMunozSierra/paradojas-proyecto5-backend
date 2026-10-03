const swaggerJsdoc = require("swagger-jsdoc");

const opciones = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "API de ParadoX",
      version: "1.0.0",
      description: "API para la red social de paradojas filosóficas ParadoX",
    },
    servers: [
      {
        url: "http://localhost:3000",
        description: "Servidor local",
      },
    ],
  },
  apis: ["./routes/*.js"],
};

const especificacionSwagger = swaggerJsdoc(opciones);

module.exports = especificacionSwagger;