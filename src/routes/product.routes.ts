import express from "express";
import {
  deleteProductByIdController,
  getProductsController,
  getProductByIdController,
  postProductController,
} from "../controllers/product.controller";
import {
  deleteSaleByIdController,
  getSalesByProductIdController,
  postNewSaleController,
  restoreOldSalesController,
} from "../controllers/sales.controller";
import { requireScope } from "../middlewares/admin.middleware";
import { Scopes } from "../enums/scopes.enum";

const router = express.Router();

router.post("/", requireScope([Scopes.write_products]), postProductController);
router.get(
  "/:id",
  requireScope([Scopes.read_products]),
  getProductByIdController,
);
router.delete(
  "/:id",
  requireScope([Scopes.read_products, Scopes.delete_products]),
  deleteProductByIdController,
);
router.get("/", requireScope([Scopes.read_products]), getProductsController());
router.post(
  "/filter",
  requireScope([Scopes.read_products]),
  getProductsController(true),
);
router.get(
  "/:id/sales/:interval",
  requireScope([Scopes.read_sales]),
  getSalesByProductIdController,
);
router.post(
  "/:id/sales",
  requireScope([Scopes.write_sales]),
  postNewSaleController,
);
router.delete(
  "/:productId/sales/:saleId",
  requireScope([Scopes.read_sales, Scopes.delete_sales]),
  deleteSaleByIdController,
);
router.put(
  "/:productId/sales/restore",
  requireScope([Scopes.read_sales, Scopes.write_sales]),
  restoreOldSalesController,
);

export { router as productRoutes };
