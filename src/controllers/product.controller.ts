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
import { SuccessMessages } from "../enums/messages.enum";

export const postProductController = withController(
  async (req: Request, res: Response) => {
    const data = handleZodParsed(ZodProductRequestBody.safeParse(req.body));
    const product = await createProductService(data);
    sendSuccess(
      res,
      { product },
      SuccessMessages.PRODUCT_CREATED,
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

    sendSuccess(res, { products }, SuccessMessages.PRODUCT_LISETED);
  });
};

export const getProductByIdController = withController(
  async (req: Request, res: Response) => {
    const product = await getProductByIdService(req.params.id);
    sendSuccess(res, { product }, SuccessMessages.PRODUCT_LISETED);
  },
);

export const deleteProductByIdController = withController(
  async (req: Request, res: Response) => {
    const product = await getProductByIdService(req.params.id);
    const deleteCount = await deleteProductService(product);
    sendSuccess(res, { deleteCount, product }, SuccessMessages.PRODUCT_DELETED);
  },
);
