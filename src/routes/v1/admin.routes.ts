import express from "express";
import { requireAdminAuth } from "../../middlewares/admin.middleware";
import { generateTokenController } from "../../controllers/admin.controller";

const router = express.Router();

router.post("/generate-token", requireAdminAuth, generateTokenController);

export { router as adminRoutes };
