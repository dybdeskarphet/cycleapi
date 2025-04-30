import express from "express";
import {
  getGrowthRateController,
  getMovingAveragesController,
} from "../controllers/lifecycle.controller";

const router = express.Router();

router.post("/:id/moving-averages", getMovingAveragesController);
router.get("/:id/growth-rates", getGrowthRateController);

export { router as lifecycleRoutes };
