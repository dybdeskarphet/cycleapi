import { Request, Response } from "express";
import { withController } from "../utils/express.utils";
import { getProductByIdService } from "../services/product.service";
import {
  growthRateService,
  movingAveragesOfSalesService,
  salesAccelerationService,
} from "../services/lifecycle.service";
import { StatusCodes } from "http-status-codes";
import { ServiceError } from "../errors/service.error";
import { Intervals } from "../enums/intervals.enum";
import { SaleDocument } from "../types/sale.types";
import { convertSalesDateRange } from "../utils/sale.utils";
import { errorIfInvalidInterval, isValidInterval } from "../utils/time.utils";

// TODO: Convert these to

const getMovingAveragesController = withController(
  async (req: Request, res: Response) => {
    const product = await getProductByIdService(req.params.id, ["sales"]);
    let { windowSize, weight, interval } = req.body;

    await errorIfInvalidInterval(interval);

    const salesInterval = await convertSalesDateRange(
      product.sales as SaleDocument[],
      interval,
    );

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
      salesInterval,
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

    const salesByDay = await convertSalesDateRange(
      product.sales as SaleDocument[],
      Intervals.Daily,
    );

    const growthRates = await growthRateService(salesByDay);

    res.status(StatusCodes.OK).json({
      message: `Growth rates of ${product.name} is listed.`,
      data: { growthRates },
    });
  },
);

const getSalesAccelerationController = withController(
  async (req: Request, res: Response) => {
    const product = await getProductByIdService(req.params.id, ["sales"]);
    const { monthly } = req.body;

    if (typeof monthly !== "boolean") {
      throw new ServiceError(
        StatusCodes.BAD_REQUEST,
        "'monthly' value should be boolean.",
      );
    }

    const salesByDay = await convertSalesDateRange(
      product.sales as SaleDocument[],
      Intervals.Daily,
    );

    const growthRates = await growthRateService(salesByDay);
    const accelerations = await salesAccelerationService(growthRates);

    res.status(StatusCodes.OK).json({
      message: `Acceleration rates of ${product.name} is listed.`,
      data: { accelerations },
    });
  },
);

export {
  getMovingAveragesController,
  getGrowthRateController,
  getSalesAccelerationController,
};
