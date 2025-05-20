import { StatusCodes } from "http-status-codes";
import {
  handleZodParsed,
  sendSuccess,
  withController,
} from "../utils/express.utils";
import { Request, Response } from "express";
import { getProductByIdService } from "../services/product.service";
import {
  createSaleService,
  deleteAllSalesAndRestoreService,
  deleteSaleService,
  getSaleByIdService,
} from "../services/sales.service";
import {
  RestoreSaleInputArraySchema,
  SaleDocument,
  ZodSaleRequestBody,
} from "../types/sale.types";
import { convertSalesDateRange } from "../utils/sale.utils";
import {
  Intervals,
  IntervalsWithInstant,
  IntervalsWithInstantSchema,
} from "../enums/intervals.enum";
import { SuccessEntries } from "../constants/messages.constants";

export const getSalesByProductIdController = withController(
  async (req: Request, res: Response) => {
    const product = await getProductByIdService(req.params.productId, [
      "sales",
    ]);
    let sales = [];
    let interval = handleZodParsed(
      IntervalsWithInstantSchema.safeParse(req.params.interval),
    );

    sales =
      interval === IntervalsWithInstant.Instant
        ? product.sales
        : await convertSalesDateRange(
            product.sales as SaleDocument[],
            //  I had to do this, I know this looks ugly but I only use instant here and noweher else
            interval as unknown as Intervals,
          );

    sendSuccess(
      res,
      {
        product: { _id: product._id, name: product.name },
        sales,
      },
      SuccessEntries.SALE_LISTED,
    );
  },
);

export const postNewSaleController = withController(
  async (req: Request, res: Response) => {
    const product = await getProductByIdService(req.params.productId);
    const body = handleZodParsed(ZodSaleRequestBody.safeParse(req.body));
    const sale = await createSaleService(product, body);

    sendSuccess(
      res,
      {
        product: { _id: product._id, name: product.name },
        sale,
      },
      SuccessEntries.SALE_CREATED,
      StatusCodes.CREATED,
    );
  },
);

export const deleteSaleByIdController = withController(
  async (req: Request, res: Response) => {
    const product = await getProductByIdService(req.params.productId);
    const sale = await getSaleByIdService(req.params.saleId);
    const deleteCount = await deleteSaleService(product, sale);

    sendSuccess(
      res,
      {
        product: { _id: product._id, name: product.name },
        deleteCount,
        sale,
      },
      SuccessEntries.SALE_DELETED,
    );
  },
);

export const restoreOldSalesController = withController(
  async (req: Request, res: Response) => {
    const body = handleZodParsed(
      RestoreSaleInputArraySchema.safeParse(req.body),
    );

    const product = await getProductByIdService(req.params.productId, [
      "sales",
    ]);

    const result = await deleteAllSalesAndRestoreService(product, body);
    sendSuccess(
      res,
      { product: { _id: product._id, name: product.name }, sales: result },
      SuccessEntries.SALE_RESTORED,
    );
  },
);
