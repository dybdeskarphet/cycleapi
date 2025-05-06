import { StatusCodes } from "http-status-codes";
import { ServiceError } from "../errors/service.error";
import {
  calculateAverageSales,
  calculateWeightedAverageSales,
  getLinearRegressionSlopeOfSales,
  getStandardDeviationOfSlopes,
} from "../utils/lifecycle.utils";
import { IMiniSale } from "../types/sale.types";
import {
  GrowthRate,
  LRegression,
  MovingAverages,
} from "../types/lifecycle.types";

export const movingAveragesOfSalesService = async (
  sales: IMiniSale[],
  windowSize: number,
  weight: boolean,
): Promise<MovingAverages.Unit[]> => {
  if (windowSize > sales.length) {
    throw new ServiceError(
      StatusCodes.BAD_REQUEST,
      "Window size of moving averages can't be larger than the length of sales.",
    );
  }

  let movingAverages: MovingAverages.Unit[] = [];

  for (let i = 0; i <= sales.length - windowSize; i++) {
    let slice = sales.slice(i, i + windowSize);
    let averageAmount = weight
      ? await calculateWeightedAverageSales(slice)
      : await calculateAverageSales(slice);

    movingAverages.push({
      amount: averageAmount,
      timestamp: slice[slice.length - 1].createdAt,
    });
  }

  return movingAverages;
};

export const growthRateService = async (
  sales: IMiniSale[],
): Promise<GrowthRate.Unit[]> => {
  let growthRates: GrowthRate.Unit[] = [];

  for (let i = 1; i < sales.length; i++) {
    const growth =
      (sales[i].amount - sales[i - 1].amount) / sales[i - 1].amount;

    growthRates.push({
      rate: growth,
      timestamp: sales[i].createdAt,
    });
  }

  return growthRates;
};

export const salesAccelerationService = async (
  growthRates: GrowthRate.Unit[],
): Promise<GrowthRate.AccelerationUnit[]> => {
  let accelerationRates: GrowthRate.AccelerationUnit[] = [];

  for (let i = 1; i < growthRates.length; i++) {
    const acceleration = growthRates[i].rate - growthRates[i - 1].rate;
    accelerationRates.push({
      acceleration,
      timestamp: growthRates[i].timestamp,
    });
  }

  return accelerationRates;
};

export const movingLinearRegressionSlopeService = async (
  sales: IMiniSale[],
  windowSize: number,
  interval: string,
) => {
  if (windowSize > sales.length) {
    throw new ServiceError(
      StatusCodes.BAD_REQUEST,
      "Window size of moving linear regression can't be larger than the length of sales.",
    );
  }

  let linearRegressionSlopes: LRegression.Unit[] = [];

  for (let i = 0; i <= sales.length - windowSize; i++) {
    let slice = sales.slice(i, i + windowSize);
    let slope = await getLinearRegressionSlopeOfSales(slice, interval);

    linearRegressionSlopes.push({
      slope,
      timestamp: slice[slice.length - 1].createdAt,
    });
  }

  return linearRegressionSlopes;
};

export const groupedLinearRegressionSlopeService = async (
  sales: IMiniSale[],
  windowSize: number,
  interval: string,
  sensitivity: number,
) => {
  if (windowSize > sales.length) {
    throw new ServiceError(
      StatusCodes.BAD_REQUEST,
      "Window size of moving linear regression can't be larger than the length of sales.",
    );
  }

  let linearRegressionSlopes: LRegression.PhaseUnit[] = [];

  for (let i = 0; i < sales.length; i += windowSize) {
    let slice = sales.slice(i, i + windowSize);
    let slope = await getLinearRegressionSlopeOfSales(slice, interval);
    linearRegressionSlopes.push({
      slope,
      phase: "",
      timestamp: slice[slice.length - 1].createdAt,
    });
  }

  let x =
    (await getStandardDeviationOfSlopes(linearRegressionSlopes)) * sensitivity;

  for (let i = 0; i < linearRegressionSlopes.length; i++) {
    const slope = linearRegressionSlopes[i].slope;
    let phase = slope > x ? "growth" : slope < x ? "decline" : "maturity";
    linearRegressionSlopes[i].phase = phase;
  }

  return linearRegressionSlopes;
};
