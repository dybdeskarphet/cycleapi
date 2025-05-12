import { Request, Response } from "express";
import {
  createProductService,
  getProductService,
  getProductByIdService,
  deleteProductService,
} from "../services/product.service";
import {
  handleControllerError,
  handleZodParsed,
  withController,
} from "../utils/express.utils";
import { StatusCodes } from "http-status-codes";
import {
  ZodProductFilterBody,
  ZodProductRequestBody,
} from "../types/product.types";

export const postProductController = withController(
  async (req: Request, res: Response) => {
    const data = handleZodParsed(ZodProductRequestBody.safeParse(req.body));
    const product = await createProductService(data);
    res
      .status(StatusCodes.CREATED)
      .json({ message: "Product created.", data: { product } });
    return;
  },
);

export const getProductsController = (hasFilter: boolean = false) => {
  return async (req: Request, res: Response) => {
    try {
      const body = hasFilter
        ? handleZodParsed(ZodProductFilterBody.safeParse(req.body))
        : {};

      const products = await getProductService(body);

      res
        .status(StatusCodes.OK)
        .json({ message: "Products are listed.", data: { products } });
      return;
    } catch (error) {
      handleControllerError(res, error, true);
      return;
    }
  };
};

export const getProductByIdController = withController(
  async (req: Request, res: Response) => {
    const product = await getProductByIdService(req.params.id);
    res
      .status(StatusCodes.OK)
      .json({ message: "Product is displayed.", data: { product } });
  },
);

export const deleteProductByIdController = withController(
  async (req: Request, res: Response) => {
    const product = await getProductByIdService(req.params.id);
    const deleteCount = await deleteProductService(product);
    res.status(StatusCodes.OK).json({
      message: `${deleteCount} product(s) deleted.`,
      data: { product },
    });
  },
);
