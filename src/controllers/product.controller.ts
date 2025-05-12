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
  sendSuccess,
  withController,
} from "../utils/express.utils";
import { StatusCodes } from "http-status-codes";
import {
  ZodProductFilterBody,
  ZodProductRequestBody,
} from "../types/product.types";
import { SuccessEntries } from "../constants/messages.constants";

export const postProductController = withController(
  async (req: Request, res: Response) => {
    const data = handleZodParsed(ZodProductRequestBody.safeParse(req.body));
    const product = await createProductService(data);
    sendSuccess(
      res,
      { product },
      SuccessEntries.PRODUCT_CREATED,
      StatusCodes.CREATED,
    );
  },
);

export const getProductsController = (hasFilter: boolean = false) => {
  return withController(async (req: Request, res: Response) => {
    const body = hasFilter
      ? handleZodParsed(ZodProductFilterBody.safeParse(req.body))
      : {};

    const products = await getProductService(body);

    sendSuccess(res, { products }, SuccessEntries.PRODUCT_LISETED);
  });
};

export const getProductByIdController = withController(
  async (req: Request, res: Response) => {
    const product = await getProductByIdService(req.params.id);
    sendSuccess(res, { product }, SuccessEntries.PRODUCT_LISETED);
  },
);

export const deleteProductByIdController = withController(
  async (req: Request, res: Response) => {
    const product = await getProductByIdService(req.params.id);
    const deleteCount = await deleteProductService(product);
    sendSuccess(res, { deleteCount, product }, SuccessEntries.PRODUCT_DELETED);
  },
);
