import express from "express";
import { getMovingAveragesController } from "../controllers/lifecycle.controller";

const router = express.Router();

router.post("/:id/moving-averages", getMovingAveragesController);

export { router as lifecycleRoutes };
