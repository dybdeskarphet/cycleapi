import { Request, Response } from "express";
import {
  handleZodParsed,
  sendSuccess,
  withController,
} from "../utils/express.utils";
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
import { SuccessEntries } from "../constants/messages.constants";

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

    sendSuccess(
      res,
      {
        product: { _id: product._id, name: product.name },
        averages,
      },
      SuccessEntries.OK_MOVING_AVERAGES,
    );
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

    sendSuccess(
      res,
      {
        product: { _id: product._id, name: product.name },
        growthRates,
      },
      SuccessEntries.OK_GROWTH_RATES,
    );
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
    const accelerationRates = await salesAccelerationService(growthRates);

    sendSuccess(
      res,
      {
        product: { _id: product._id, name: product.name },
        accelerationRates,
      },
      SuccessEntries.OK_ACCELERATION_RATES,
    );
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

    sendSuccess(
      res,
      {
        product: { _id: product._id, name: product.name },
        slopes,
      },
      SuccessEntries.OK_LINEAR_REGRESSION_SLOPES,
    );
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

    sendSuccess(
      res,
      {
        product: { _id: product._id, name: product.name },
        maturity_top: result.maturity_top,
        maturity_bottom: result.maturity_bottom,
        slopes: result.slopes,
      },
      SuccessEntries.OK_PHASES,
    );
  },
);
