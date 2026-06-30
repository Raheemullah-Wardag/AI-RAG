import swaggerJSDoc from 'swagger-jsdoc';

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Node Production API',
      version: '1.0.0',
      description: 'Users, conversations, messages, and auth API',
    },
    servers: [{ url: 'http://localhost:8000' }],
  },
  apis: ['./routes/**/*.js'], // tells it where to look for documentation comments
};

export const swaggerSpec = swaggerJSDoc(options);