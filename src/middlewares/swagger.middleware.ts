import dotenv from "dotenv";
import ip from "ip";
import YAML from "yamljs";
import path from "path";
import swaggerUi from "swagger-ui-express";
import { NextFunction, Request, Response } from "express";

dotenv.config();
const port = process.env.API_PORT || 3000;
const openApiDocument = YAML.load(
  path.join(__dirname, "../../docs/openapi.yaml"),
);

const docsMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const localServerUrl = `http://${ip.address()}:${port}/api/v1`;
  openApiDocument.servers = [
    { url: localServerUrl, description: "Local server URL (v1)." },
  ];

  swaggerUi.setup(openApiDocument)(req, res, next);
};

export default docsMiddleware;
