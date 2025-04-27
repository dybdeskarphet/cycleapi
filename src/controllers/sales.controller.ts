import { StatusCodes } from "http-status-codes";
import { withController } from "../utils/with-controller";
import { Request, Response } from "express";
import { getProductByIdService } from "../services/product.service";
import {
  createSaleService,
  deleteSaleService,
  getSaleByIdService,
} from "../services/sales.service";

const getSalesByProductIdController = withController(
  async (req: Request, res: Response) => {
    const product = await getProductByIdService(req.params.id, ["sales"]);
    res.status(StatusCodes.CREATED).json({
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

export {
  deleteSaleByIdController,
  postNewSaleController,
  getSalesByProductIdController,
};
