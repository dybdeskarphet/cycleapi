import express, { Express, NextFunction, Request, Response } from "express";
import ip from "ip";
import connectDatabase from "./db";
import { productRoutes } from "./routes/product.routes";
import { ServiceError } from "./errors/service.error";

const app: Express = express();
const port = process.env.API_PORT || 3000;

connectDatabase(__filename);

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

app.use("/products", productRoutes);
app.get("/", (req: Request, res: Response) => {
  res.send("Hello world!");
});

app.listen(port, () => {
  console.log(`Server is running on http://${ip.address()}:${port}`);
});
