import express from "express";
import {
  deleteSaleByIdController,
  getAllProductsController,
  getProductByIdController,
  postNewSaleController,
  postProductController,
} from "../controllers/product.controller";

const router = express.Router();

router.post("/", postProductController);
router.get("/:id", getProductByIdController);
router.get("/", getAllProductsController);
router.post("/:id/sales", postNewSaleController);
router.delete("/:productId/sales/:saleId", deleteSaleByIdController);

export { router as productRoutes };
