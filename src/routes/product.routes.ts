import express from "express";
import {
  getAllProductsController,
  getProductByIdController,
  postProductController,
} from "../controllers/product.controller";

const router = express.Router();

/**
 * @swagger
 * /api/v1/products:
 *  get:
 *    summary: Get all products
 *    responses:
 *      200:
 *        description: List of products
 *    tags:
 *      - Products
 *
 */
router.post("/", postProductController);

/**
 * @swagger
 * /api/v1/products/{id}:
 *  get:
 *    summary: Get a product by ID
 *    responses:
 *      200:
 *        description: The requested product.
 *      404:
 *        description: Product not found.
 *    parameters:
 *      - in: path
 *        name: id
 *        required: true
 *        schema:
 *          type: string
 *        description: The ID of the product
 *    tags:
 *      - Products
 */
router.get("/:id", getProductByIdController);

/**
 * @swagger
 * /api/v1/products:
 *  post:
 *    summary: Create a new product
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            properties:
 *              name:
 *                type: string
 *              category:
 *                type: string
 *              launchDate:
 *                type: string
 *                format: date
 *              price:
 *                type: number
 *    responses:
 *      201:
 *        description: Product created
 *    tags:
 *      - Products
 */
router.get("/", getAllProductsController);

export { router as productRoutes };
