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

const router = express.Router();

router.post("/", postProductController);
router.get("/:id", getProductByIdController);
router.delete("/:id", deleteProductByIdController);
router.get("/", getProductsController());
router.post("/filter", getProductsController(true));
router.get("/:id/sales/:interval", getSalesByProductIdController);
router.post("/:id/sales", postNewSaleController);
router.delete("/:productId/sales/:saleId", deleteSaleByIdController);
router.put("/:productId/sales/restore", restoreOldSalesController);

export { router as productRoutes };
