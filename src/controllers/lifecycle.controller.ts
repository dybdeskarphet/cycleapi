import { Request, Response } from "express";
import { withController } from "../utils/with-controller";
import { getProductByIdService } from "../services/product.service";
import { salesPerDayService } from "../services/sales.service";
import { UnitTypes } from "../types/unit.types";
import {
  growthRateService,
  movingAveragesOfSalesService,
  salesAccelerationService,
} from "../services/lifecycle.service";
import { StatusCodes } from "http-status-codes";
import { ServiceError } from "../errors/service.error";

// TODO: Split this to weighted and simple
const getMovingAveragesController = withController(
  async (req: Request, res: Response) => {
    const product = await getProductByIdService(req.params.id, ["sales"]);
    const salesByDay = await salesPerDayService(
      product,
      product.sales as UnitTypes.UnitDocument[],
    );

    let { windowSize, weight } = req.body;

    if (windowSize <= 0) {
      throw new ServiceError(
        StatusCodes.BAD_REQUEST,
        "'windowSize' value should be larger than 0.",
      );
    }

    if (typeof weight !== "boolean") {
      throw new ServiceError(
        StatusCodes.BAD_REQUEST,
        "'weight' value should be boolean.",
      );
    }

    const averages = await movingAveragesOfSalesService(
      salesByDay,
      windowSize,
      weight,
    );

    res.status(StatusCodes.OK).json({
      message: `Moving averages of ${product.name} is listed.`,
      data: { averages },
    });
  },
);

const getGrowthRateController = withController(
  async (req: Request, res: Response) => {
    const product = await getProductByIdService(req.params.id, ["sales"]);
    const { monthly } = req.body;
    if (typeof monthly !== "boolean") {
      throw new ServiceError(
        StatusCodes.BAD_REQUEST,
        "'monthly' value should be boolean.",
      );
    }

    const salesByDay = await salesPerDayService(
      product,
      product.sales as UnitTypes.UnitDocument[],
    );

    const growthRates = await growthRateService(salesByDay);

    res.status(StatusCodes.OK).json({
      message: `Growth rates of ${product.name} is listed.`,
      data: { growthRates },
    });
  },
);

const salesAccelerationController = withController(
  async (req: Request, res: Response) => {
    const product = await getProductByIdService(req.params.id, ["sales"]);
    const { monthly } = req.body;
    if (typeof monthly !== "boolean") {
      throw new ServiceError(
        StatusCodes.BAD_REQUEST,
        "'monthly' value should be boolean.",
      );
    }

    const salesByDay = await salesPerDayService(
      product,
      product.sales as UnitTypes.UnitDocument[],
    );

    const growthRates = await growthRateService(salesByDay);
    const salesAcceleration = await salesAccelerationService(growthRates);

    res.status(StatusCodes.OK).json({
      message: `Acceleration rates of ${product.name} is listed.`,
      data: { salesAcceleration },
    });
  },
);

export { getMovingAveragesController, getGrowthRateController };
