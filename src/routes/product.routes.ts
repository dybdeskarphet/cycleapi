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
  postNewSaleController,
} from "../controllers/sales.controller";

const router = express.Router();

router.post("/", postProductController);
router.get("/:id", getProductByIdController);
router.delete("/:id", deleteProductByIdController);
router.get("/", getAllProductsController);
router.get("/:id/sales/:interval", getSalesByProductIdController);
router.post("/:id/sales", postNewSaleController);
router.delete("/:productId/sales/:saleId", deleteSaleByIdController);

export { router as productRoutes };
