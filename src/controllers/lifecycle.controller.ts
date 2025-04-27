import { Request, Response } from "express";
import { withController } from "../utils/with-controller";
import { getProductByIdService } from "../services/product.service";
import { salesPerDayService } from "../services/sales.service";
import { UnitTypes } from "../types/unit.types";
import { movingAveragesOfSalesService } from "../services/lifecycle.service";
import { StatusCodes } from "http-status-codes";
import { ServiceError } from "../errors/service.error";

const getMovingAveragesController = withController(
  async (req: Request, res: Response) => {
    const product = await getProductByIdService(req.params.id, ["sales"]);
    let windowSize = 0;
    const salesByDay = await salesPerDayService(
      product,
      product.sales as UnitTypes.UnitDocument[],
    );

    if (req.body.windowSize) {
      windowSize = req.body.windowSize;
    } else {
      throw new ServiceError(
        StatusCodes.BAD_REQUEST,
        "Request body should have a windowSize value.",
      );
    }

    const averages = await movingAveragesOfSalesService(salesByDay, windowSize);

    res.status(StatusCodes.OK).json({
      message: `Moving averages of ${product.name} is listed.`,
      data: { averages },
    });
  },
);

export { getMovingAveragesController };
