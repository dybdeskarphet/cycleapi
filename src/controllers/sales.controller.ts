import { StatusCodes } from "http-status-codes";
import { withController } from "../utils/with-controller";
import { Request, Response } from "express";
import { getProductByIdService } from "../services/product.service";
import {
  createSaleService,
  deleteSaleService,
  getSaleByIdService,
  salesPerDayService,
} from "../services/sales.service";
import { UnitTypes } from "../types/unit.types";

const getSalesByProductIdController = withController(
  async (req: Request, res: Response) => {
    const product = await getProductByIdService(req.params.id, ["sales"]);
    res.status(StatusCodes.OK).json({
      message: `All sales are listed for ${product.name}.`,
      data: product.sales,
    });
    return;
  },
);

const postNewSaleController = withController(
  async (req: Request, res: Response) => {
    const product = await getProductByIdService(req.params.id);
    const sale = await createSaleService(product, req.body);
    res
      .status(StatusCodes.CREATED)
      .json({ message: "New sale created.", data: { sale } });
    return;
  },
);

const deleteSaleByIdController = withController(
  async (req: Request, res: Response) => {
    const product = await getProductByIdService(req.params.productId);
    const sale = await getSaleByIdService(req.params.saleId);
    const deleteCount = await deleteSaleService(product, sale);
    res
      .status(StatusCodes.OK)
      .json({ message: `${deleteCount} sale(s) deleted.`, data: { sale } });
  },
);

const getSalesPerDayByProductIdController = withController(
  async (req: Request, res: Response) => {
    const product = await getProductByIdService(req.params.id, ["sales"]);
    const result = await salesPerDayService(
      product,
      product.sales as UnitTypes.UnitDocument[],
    );
    res.status(StatusCodes.OK).json({
      message: `All sales are grouped by day and listed for ${product.name}.`,
      data: result,
    });
  },
);

export {
  deleteSaleByIdController,
  postNewSaleController,
  getSalesByProductIdController,
  getSalesPerDayByProductIdController,
};
