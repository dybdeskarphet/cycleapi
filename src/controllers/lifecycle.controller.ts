import { Request, Response } from "express";
import { withController } from "../utils/express.utils";
import { getProductByIdService } from "../services/product.service";
import {
  groupedLinearRegressionSlopeService,
  growthRateService,
  movingAveragesOfSalesService,
  movingLinearRegressionSlopeService,
  salesAccelerationService,
} from "../services/lifecycle.service";
import { StatusCodes } from "http-status-codes";
import { ServiceError } from "../errors/service.error";
import { Intervals } from "../enums/intervals.enum";
import { SaleDocument } from "../types/sale.types";
import { convertSalesDateRange } from "../utils/sale.utils";
import { errorIfInvalidInterval, isValidInterval } from "../utils/time.utils";

export const getMovingAveragesController = withController(
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

export const getGrowthRateController = withController(
  async (req: Request, res: Response) => {
    const product = await getProductByIdService(req.params.id, ["sales"]);
    const { interval } = req.body;
    await errorIfInvalidInterval(interval);

    const salesInterval = await convertSalesDateRange(
      product.sales as SaleDocument[],
      interval,
    );

    const growthRates = await growthRateService(salesInterval);

    res.status(StatusCodes.OK).json({
      message: `Growth rates of ${product.name} is listed.`,
      data: { growthRates },
    });
  },
);

export const getSalesAccelerationController = withController(
  async (req: Request, res: Response) => {
    const product = await getProductByIdService(req.params.id, ["sales"]);
    const { interval } = req.body;
    await errorIfInvalidInterval(interval);

    const salesInterval = await convertSalesDateRange(
      product.sales as SaleDocument[],
      interval,
    );

    const growthRates = await growthRateService(salesInterval);
    const accelerations = await salesAccelerationService(growthRates);

    res.status(StatusCodes.OK).json({
      message: `Acceleration rates of ${product.name} is listed.`,
      data: { accelerations },
    });
  },
);

export const getMovingLinearRegressionSlopesController = withController(
  async (req: Request, res: Response) => {
    let { windowSize, weight, interval } = req.body;

    await errorIfInvalidInterval(interval);

    if (windowSize <= 0) {
      throw new ServiceError(
        StatusCodes.BAD_REQUEST,
        "'windowSize' value should be larger than 0.",
      );
    }

    const product = await getProductByIdService(req.params.id, ["sales"]);

    const salesInterval = await convertSalesDateRange(
      product.sales as SaleDocument[],
      interval,
    );

    const slopes = await movingLinearRegressionSlopeService(
      salesInterval,
      windowSize,
      interval,
    );

    res.status(StatusCodes.OK).json({
      message: `Linear regression slopes of ${product.name} is listed.`,
      data: { slopes },
    });
  },
);

export const getGroupedLinearRegressionSlopesController = withController(
  async (req: Request, res: Response) => {
    let { windowSize, weight, interval, sensitivity } = req.body;

    await errorIfInvalidInterval(interval);

    if (windowSize <= 0) {
      throw new ServiceError(
        StatusCodes.BAD_REQUEST,
        "'windowSize' value should be larger than 0.",
      );
    }

    if (
      !sensitivity ||
      typeof sensitivity !== "number" ||
      sensitivity < 0 ||
      sensitivity > 1
    ) {
      throw new ServiceError(
        StatusCodes.BAD_REQUEST,
        "'sensitivity' value should be between 0 and 1.",
      );
    }

    const product = await getProductByIdService(req.params.id, ["sales"]);

    const salesInterval = await convertSalesDateRange(
      product.sales as SaleDocument[],
      interval,
    );

    const slopes = await groupedLinearRegressionSlopeService(
      salesInterval,
      windowSize,
      interval,
      sensitivity,
    );

    res.status(StatusCodes.OK).json({
      message: `Linear regression slopes of ${product.name} is listed.`,
      data: { slopes },
    });
  },
);
