import { Request, Response } from "express";
import {
  createProductService,
  getProductService,
  postNewSaleService,
} from "../services/product.service";
import { handleControllerError } from "../utils/error-response";
import { withController } from "../utils/with-controller";

const postProductController = withController(
  async (req: Request, res: Response) => {
    const product = await createProductService(req.body);
    res.status(201).json({ message: "Product created.", data: { product } });
    return;
  },
);

const getAllProductsController = withController(
  async (req: Request, res: Response) => {
    const products = await getProductService();
    res
      .status(201)
      .json({ message: "All products are listed.", data: { products } });
  },
);

const getProductByIdController = withController(
  async (req: Request, res: Response) => {
    const product = await getProductService({ _id: req.params.id });
    res
      .status(201)
      .json({ message: "Product is displayed.", data: { product } });
  },
);

const postNewSaleController = withController(
  async (req: Request, res: Response) => {
    await getProductService({ _id: req.params.id });
    const sale = await postNewSaleService(req.params.id, req.body);
    res.status(201).json({ message: "New sale created.", data: { sale } });
    return;
  },
);

export {
  postProductController,
  getAllProductsController,
  getProductByIdController,
  postNewSaleController,
};
