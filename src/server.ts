import express, { Express, NextFunction, Request, Response } from "express";
import ip from "ip";
import connectDatabase from "./db";
import { productRoutes } from "./routes/product.routes";
import { lifecycleRoutes } from "./routes/lifecycle.routes";
import { openApiDocument } from "./docs/openapi";
import path from "path";

const app: Express = express();
const port = process.env.API_PORT || 3000;

await connectDatabase(__filename);

// Check if the request is a valid JSON
app.use(
  express.json({
    verify: (
      req: Request,
      res: Response,
      buf: Buffer,
      encoding: BufferEncoding,
    ) => {
      try {
        JSON.parse(buf.toString(encoding));
        return;
      } catch (e) {
        res.status(400).json({ message: "Invalid JSON format." });
        return;
      }
    },
  }),
);

app.get("/api-docs.json", (req, res) => {
  res.json(openApiDocument);
});

app.get("/api-docs", (req, res) => {
  res.sendFile(path.join(__dirname, "../docs/rapidoc.html"));
});

app.get("/", (req: Request, res: Response) => {
  // NOTE: Change it to /api/v1 before release.
  res.redirect("/api-docs");
});

app.get("/api/v1", (req: Request, res: Response) => {
  res.send("Go to /api-docs to see the full documentation.");
});

app.use("/api/v1/products", productRoutes);
app.use("/api/v1/lifecycle", lifecycleRoutes);

app.listen(port, () => {
  console.log(`Server is running on http://${ip.address()}:${port}`);
});
