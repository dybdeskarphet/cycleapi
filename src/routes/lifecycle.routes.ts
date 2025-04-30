import express from "express";
import {
  getGrowthRateController,
  getMovingAveragesController,
  getSalesAccelerationController,
} from "../controllers/lifecycle.controller";

const router = express.Router();

router.post("/:id/moving-averages", getMovingAveragesController);
router.post("/:id/growth-rates", getGrowthRateController);
router.post("/:id/acceleration-rates", getSalesAccelerationController);

export { router as lifecycleRoutes };
