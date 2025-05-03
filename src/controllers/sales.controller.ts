import { StatusCodes } from "http-status-codes";
import { withController } from "../utils/express.utils";
import { Request, Response } from "express";
import { getProductByIdService } from "../services/product.service";
import {
  createSaleService,
  deleteAllSalesAndRestoreService,
  deleteSaleService,
  getSaleByIdService,
} from "../services/sales.service";
import { ServiceError } from "../errors/service.error";
import { RestoreSaleInputArraySchema, SaleDocument } from "../types/sale.types";
import { convertSalesDateRange } from "../utils/sale.utils";
import { isValidInterval } from "../utils/time.utils";

export const getSalesByProductIdController = withController(
  async (req: Request, res: Response) => {
    const product = await getProductByIdService(req.params.id, ["sales"]);
    let oldSales = product.sales as SaleDocument[];
    let sales = [];
    let interval = req.params.interval;

    if (isValidInterval(interval)) {
      sales = await convertSalesDateRange(oldSales, interval);
    } else if (interval === "instant") {
      sales = oldSales;
    } else {
      throw new ServiceError(
        StatusCodes.BAD_REQUEST,
        "Interval should be 'daily', 'weekly', 'monthly', 'yearly' or 'instant'",
      );
    }

    res.status(StatusCodes.OK).json({
      message: `All sales are listed for ${product.name}.`,
      data: sales,
    });
    return;
  },
);

export const postNewSaleController = withController(
  async (req: Request, res: Response) => {
    const product = await getProductByIdService(req.params.id);
    const sale = await createSaleService(product, req.body);
    res
      .status(StatusCodes.CREATED)
      .json({ message: "New sale created.", data: { sale } });
    return;
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
    const parseResult = RestoreSaleInputArraySchema.safeParse(req.body);

    if (!parseResult.success) {
      throw new ServiceError(
        StatusCodes.BAD_REQUEST,
        "Invalid request body:",
        parseResult.error.issues,
      );
    }

    const result = await deleteAllSalesAndRestoreService(
      product,
      parseResult.data,
    );

    res
      .status(StatusCodes.OK)
      .json({ message: `Sales are restored.`, data: { sales: result } });
  },
);
