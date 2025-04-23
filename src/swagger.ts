import swaggerJSDoc from "swagger-jsdoc";
import dotenv from "dotenv";
import ip from "ip";

dotenv.config();
const port = process.env.API_PORT || 3000;

const options: swaggerJSDoc.Options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "CycleAPI",
      version: "1.0.0",
      description: "Product forecasting and recommendation API",
    },
    servers: [
      {
        url: `http://${ip.address()}:${port}`,
      },
    ],
  },
  apis: ["./**/*.ts"],
};

const swaggerSpec = swaggerJSDoc(options);
export default swaggerSpec;
