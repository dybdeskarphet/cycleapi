import { StatusCodes } from "http-status-codes";
import { handleZodParsed, withController } from "../utils/express.utils";
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

export const getSalesByProductIdController = withController(
  async (req: Request, res: Response) => {
    const product = await getProductByIdService(req.params.id, ["sales"]);
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

    res.status(StatusCodes.OK).json({
      message: `All sales are listed for ${product.name}.`,
      data: {
        sales: sales,
      },
    });
  },
);

export const postNewSaleController = withController(
  async (req: Request, res: Response) => {
    const product = await getProductByIdService(req.params.id);
    const body = handleZodParsed(ZodSaleRequestBody.safeParse(req.body));
    const sale = await createSaleService(product, body);

    res
      .status(StatusCodes.CREATED)
      .json({ message: "New sale created.", data: { sale } });
  },
);

export const deleteSaleByIdController = withController(
  async (req: Request, res: Response) => {
    const product = await getProductByIdService(req.params.productId);
    const sale = await getSaleByIdService(req.params.saleId);
    const deleteCount = await deleteSaleService(product, sale);

    res
      .status(StatusCodes.OK)
      .json({ message: `${deleteCount} sale(s) deleted.`, data: { sale } });
  },
);

export const restoreOldSalesController = withController(
  async (req: Request, res: Response) => {
    const product = await getProductByIdService(req.params.productId, [
      "sales",
    ]);

    const body = handleZodParsed(
      RestoreSaleInputArraySchema.safeParse(req.body),
    );

    const result = await deleteAllSalesAndRestoreService(product, body);

    res
      .status(StatusCodes.OK)
      .json({ message: `Sales are restored.`, data: { sales: result } });
  },
);
