import express, { Express, NextFunction, Request, Response } from "express";
import ip from "ip";
import connectDatabase from "./db";
import { productRoutes } from "./routes/product.routes";
import handleInvalidJson from "./middlewares/invalidsyntax.middleware";

const app: Express = express();
const port = process.env.API_PORT || 3000;

connectDatabase(__filename);

app.use(express.json());
app.use("/products", productRoutes);
app.get("/", (req: Request, res: Response) => {
  res.send("Hello world!");
});
// TODO: Invalid JSON syntax errors should be handled via a middleware
// because it gives the error way before the endpoint error handler handles it.
// Though it doesn't work in this state, fix it whenever you can.
app.use(handleInvalidJson);

app.listen(port, () => {
  console.log(`Server is running on http://${ip.address()}:${port}`);
});
