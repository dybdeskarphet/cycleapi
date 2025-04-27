import express from "express";
import {
  deleteProductByIdController,
  getAllProductsController,
  getProductByIdController,
  postProductController,
} from "../controllers/product.controller";
import {
  deleteSaleByIdController,
  getSalesByProductIdController,
  getSalesPerDayByProductIdController,
  postNewSaleController,
} from "../controllers/sales.controller";

const router = express.Router();

router.post("/", postProductController);
router.get("/:id", getProductByIdController);
router.delete("/:id", deleteProductByIdController);
router.get("/", getAllProductsController);
router.get("/:id/sales", getSalesByProductIdController);
router.post("/:id/sales", postNewSaleController);
router.get("/:id/sales/per-day", getSalesPerDayByProductIdController);
router.delete("/:productId/sales/:saleId", deleteSaleByIdController);

export { router as productRoutes };
