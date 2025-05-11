import { Request, Response } from "express";
import { handleZodParsed, withController } from "../utils/express.utils";
import { getProductByIdService } from "../services/product.service";
import {
  groupedLinearRegressionSlopeService,
  growthRateService,
  movingAveragesOfSalesService,
  movingLinearRegressionSlopeService,
  salesAccelerationService,
} from "../services/lifecycle.service";
import { StatusCodes } from "http-status-codes";
import { SaleDocument } from "../types/sale.types";
import { convertSalesDateRange } from "../utils/sale.utils";
import {
  GrowthRate,
  LRegression,
  MovingAverages,
} from "../types/lifecycle.types";

export const getMovingAveragesController = withController(
  async (req: Request, res: Response) => {
    const product = await getProductByIdService(req.params.id, ["sales"]);
    let data = handleZodParsed(MovingAverages.RequestBody.safeParse(req.body));

    const salesInterval = await convertSalesDateRange(
      product.sales as SaleDocument[],
      data.interval,
    );

    const averages = await movingAveragesOfSalesService(
      salesInterval,
      data.windowSize,
      data.weight,
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
    const data = handleZodParsed(GrowthRate.RequestBody.safeParse(req.body));

    const salesInterval = await convertSalesDateRange(
      product.sales as SaleDocument[],
      data.interval,
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
    const data = handleZodParsed(GrowthRate.RequestBody.safeParse(req.body));

    const salesInterval = await convertSalesDateRange(
      product.sales as SaleDocument[],
      data.interval,
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
    const data = handleZodParsed(LRegression.RequestBody.safeParse(req.body));
    const product = await getProductByIdService(req.params.id, ["sales"]);
    const salesInterval = await convertSalesDateRange(
      product.sales as SaleDocument[],
      data.interval,
    );

    const slopes = await movingLinearRegressionSlopeService(
      salesInterval,
      data.windowSize,
      data.interval,
    );

    res.status(StatusCodes.OK).json({
      message: `Linear regression slopes of ${product.name} is listed.`,
      data: { slopes },
    });
  },
);

export const getGroupedLinearRegressionSlopesController = withController(
  async (req: Request, res: Response) => {
    const { windowSize, interval, sensitivity } = handleZodParsed(
      LRegression.RequestBodyWithSensitivity.safeParse(req.body),
    );

    const product = await getProductByIdService(req.params.id, ["sales"]);

    const salesInterval = await convertSalesDateRange(
      product.sales as SaleDocument[],
      interval,
    );

    const result = await groupedLinearRegressionSlopeService(
      salesInterval,
      windowSize,
      interval,
      sensitivity,
    );

    res.status(StatusCodes.OK).json({
      message: `Linear regression slopes of ${product.name} is listed.`,
      data: {
        maturity_top: result.maturity_top,
        maturity_bottom: result.maturity_bottom,
        slopes: result.slopes,
      },
    });
  },
);
