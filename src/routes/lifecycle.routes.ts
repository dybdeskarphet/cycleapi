import express from "express";
import {
  getGroupedLinearRegressionSlopesController,
  getGrowthRateController,
  getMovingAveragesController,
  getMovingLinearRegressionSlopesController,
  getSalesAccelerationController,
} from "../controllers/lifecycle.controller";
import { requireScope } from "../middlewares/admin.middleware";
import { Scopes } from "../enums/scopes.enum";

const router = express.Router();

router.post(
  "/:id/moving-averages",
  requireScope([Scopes.read_products, Scopes.read_sales]),
  getMovingAveragesController,
);
router.post(
  "/:id/growth-rates",
  requireScope([Scopes.read_products, Scopes.read_sales]),
  getGrowthRateController,
);
router.post(
  "/:id/acceleration-rates",
  requireScope([Scopes.read_products, Scopes.read_sales]),
  getSalesAccelerationController,
);
router.post(
  "/:id/lr-slopes",
  requireScope([Scopes.read_products, Scopes.read_sales]),
  getMovingLinearRegressionSlopesController,
);
router.post(
  "/:id/phases-with-lr",
  requireScope([Scopes.read_products, Scopes.read_sales]),
  getGroupedLinearRegressionSlopesController,
);

export { router as lifecycleRoutes };
