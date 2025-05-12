import { StatusCodes } from "http-status-codes";
import { ApiError } from "../errors/api.error";
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
import { ErrorMessages } from "../enums/messages.enum";

export const movingAveragesOfSalesService = async (
  sales: IMiniSale[],
  windowSize: number,
  weight: boolean,
): Promise<MovingAverages.Unit[]> => {
  if (windowSize > sales.length) {
    throw new ApiError(
      StatusCodes.BAD_REQUEST,
      ErrorMessages.WINDOW_SIZE_INCOMPATIBLE_LENGTH,
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
    throw new ApiError(
      StatusCodes.BAD_REQUEST,
      ErrorMessages.WINDOW_SIZE_INCOMPATIBLE_LENGTH,
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
    throw new ApiError(
      StatusCodes.BAD_REQUEST,
      ErrorMessages.WINDOW_SIZE_INCOMPATIBLE_LENGTH,
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
  let epsilon = 0;

  for (let i = 0; i < linearRegressionSlopes.length; i++) {
    const slope = linearRegressionSlopes[i].slope;
    epsilon = 0.5 * x;
    let phase =
      Math.abs(slope - x) < epsilon
        ? "maturity"
        : slope > x
          ? "growth"
          : "decline";
    linearRegressionSlopes[i].phase = phase;
  }

  return {
    slopes: linearRegressionSlopes,
    maturity_top: x + epsilon,
    maturity_bottom: x - epsilon,
  };
};
