import express from "express";
import {
  getGroupedLinearRegressionSlopesController,
  getGrowthRateController,
  getMovingAveragesController,
  getMovingLinearRegressionSlopesController,
  getSalesAccelerationController,
} from "../controllers/lifecycle.controller";

const router = express.Router();

router.post("/:id/moving-averages", getMovingAveragesController);
router.post("/:id/growth-rates", getGrowthRateController);
router.post("/:id/acceleration-rates", getSalesAccelerationController);
router.post("/:id/lr-slopes", getMovingLinearRegressionSlopesController);
router.post("/:id/phases-with-lr", getGroupedLinearRegressionSlopesController);

export { router as lifecycleRoutes };
