import express from "express";
import { postProductController } from "../controllers/product.controller";

const router = express.Router();

router.post("/", postProductController);

export { router as productRoutes };
