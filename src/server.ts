import "body-parser";
import { consola } from "consola";
import "dotenv/config";
import express, { Express, Request, Response } from "express";
import ip from "ip";
import path from "path";
import connectDatabase from "./db";
import { openApiDocument } from "./docs/openapi";
import { errorHandler } from "./middlewares/error-handler.middlware";
import { adminRoutes } from "./routes/v1/admin.routes";
import { lifecycleRoutes } from "./routes/v1/lifecycle.routes";
import { productRoutes } from "./routes/v1/product.routes";
import { jsonVerify } from "./utils/express.utils";

const app: Express = express();
const port = process.env.API_PORT || 3000;

await connectDatabase(path.relative(process.cwd(), __filename));

app.use(express.json({ verify: jsonVerify }));

app.use("/assets", express.static(path.join(__dirname, "..", "assets")));

app.get("/api-docs.json", (req, res) => {
  res.json(openApiDocument);
});

app.get("/api-docs", (req, res) => {
  res.sendFile(path.join(__dirname, "../docs/rapidoc.html"));
});

app.get("/api/v1", (req: Request, res: Response) => {
  res.send("Go to /api-docs to see the full documentation.");
});

app.use("/api/v1/products", productRoutes);
app.use("/api/v1/lifecycle", lifecycleRoutes);
app.use("/api/v1/admin", adminRoutes);
app.use(errorHandler);

if (process.env.NODE_ENV !== "development") {
  const prodChoice = await consola.prompt(
    "Do you want to start the server in production mode?",
    {
      type: "confirm",
    },
  );

  if (!prodChoice) {
    process.exit(0);
  }
}

app.listen(port, () => {
  consola.box(
    `🚀 Server is running on http://${ip.address()}:${port}\n📃 Check http://${ip.address()}:${port}/api-docs for API documentation`,
  );
});
