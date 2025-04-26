import { Request, Response } from "express";
import {
  createProductService,
  getProductService,
  createSaleService,
  getProductByIdService,
  getSaleByIdService,
  deleteSaleService,
} from "../services/product.service";
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
    const product = await getProductByIdService(req.params.id);
    res
      .status(201)
      .json({ message: "Product is displayed.", data: { product } });
  },
);

const postNewSaleController = withController(
  async (req: Request, res: Response) => {
    const product = await getProductByIdService(req.params.id);
    const sale = await createSaleService(product, req.body);
    res.status(201).json({ message: "New sale created.", data: { sale } });
    return;
  },
);

const deleteSaleByIdController = withController(
  async (req: Request, res: Response) => {
    const product = await getProductByIdService(req.params.productId);
    const sale = await getSaleByIdService(req.params.saleId);
    const deleteCount = await deleteSaleService(product, sale);
    res
      .status(201)
      .json({ message: `${deleteCount} sale(s) deleted.`, data: { sale } });
  },
);

export {
  postProductController,
  getAllProductsController,
  getProductByIdController,
  postNewSaleController,
  deleteSaleByIdController,
};
