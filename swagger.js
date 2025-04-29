const swaggerJSDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
require("dotenv").config();

const options = {
  definition: {
    openapi: "3.0.0",

    info: {
      title: "Careers API Documentation",
      version: "1.0.0",
      description: "Documentation for your Node.js API",
    },
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT', 
        },
      },
    },
    security: [
      {
        bearerAuth: [], 
      },
    ],
    servers: [
      {
        // url: "http://localhost:3001",
        url: "https://careers-api-six.vercel.app",

      },
    ],
  },
  apis: [__dirname + "/routes/*.js"]
};

const swaggerSpec = swaggerJSDoc(options);

module.exports = { swaggerUi, swaggerSpec };
