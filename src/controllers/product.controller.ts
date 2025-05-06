import { Request, Response } from "express";
import {
  createProductService,
  getProductService,
  getProductByIdService,
  deleteProductService,
} from "../services/product.service";
import { handleZodParsed, withController } from "../utils/express.utils";
import { StatusCodes } from "http-status-codes";
import { ZodProductRequestBody } from "../types/product.types";

const postProductController = withController(
  async (req: Request, res: Response) => {
    const data = handleZodParsed(ZodProductRequestBody.safeParse(req.body));
    const product = await createProductService(data);
    res
      .status(StatusCodes.CREATED)
      .json({ message: "Product created.", data: { product } });
    return;
  },
);

// TODO: Use this as get products by filter, if no filter is provided, it gets all.
const getAllProductsController = withController(
  async (req: Request, res: Response) => {
    const products = await getProductService();
    res
      .status(StatusCodes.OK)
      .json({ message: "All products are listed.", data: { products } });
  },
);

const getProductByIdController = withController(
  async (req: Request, res: Response) => {
    const product = await getProductByIdService(req.params.id);
    res
      .status(StatusCodes.OK)
      .json({ message: "Product is displayed.", data: { product } });
  },
);

const deleteProductByIdController = withController(
  async (req: Request, res: Response) => {
    const product = await getProductByIdService(req.params.id);
    const deleteCount = await deleteProductService(product);
    res.status(StatusCodes.OK).json({
      message: `${deleteCount} product(s) deleted.`,
      data: { product },
    });
  },
);

export {
  postProductController,
  getAllProductsController,
  getProductByIdController,
  deleteProductByIdController,
};
