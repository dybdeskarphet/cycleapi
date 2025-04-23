import { Request, Response } from "express";
import {
  createProductService,
  getProductService,
} from "../services/product.service";
import { handleControllerError } from "../utils/error-response";

const postProductController = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const product = await createProductService(req.body);
    res.status(201).json({ message: "Product created.", data: { product } });
  } catch (error) {
    handleControllerError(res, error, true);
    return;
  }
};

const getAllProductsController = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const products = await getProductService();
    res
      .status(201)
      .json({ message: "All products are listed.", data: { products } });
  } catch (error) {
    handleControllerError(res, error, true);
    return;
  }
};

const getProductByIdController = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const product = await getProductService({ _id: req.params.id });
    res
      .status(201)
      .json({ message: "Product is displayed.", data: { product } });
  } catch (error) {
    handleControllerError(res, error, true);
    return;
  }
};

export {
  postProductController,
  getAllProductsController,
  getProductByIdController,
};
