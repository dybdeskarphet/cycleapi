import express, { Express, Request, Response } from "express";
import ip from "ip";
import connectDatabase from "./db";

const app: Express = express();
const port = process.env.API_PORT || 3000;

connectDatabase(__filename);

app.use(express.json());

app.get("/", (req: Request, res: Response) => {
  res.send("Hello world!");
});

app.listen(port, () => {
  console.log(`Server is running on http://${ip.address()}:${port}`);
});
