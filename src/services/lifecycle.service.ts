import { StatusCodes } from "http-status-codes";
import { ServiceError } from "../errors/service.error";
import {
  calculateAverageSales,
  calculateWeightedAverageSales,
  getLinearRegressionSlopeOfSales,
} from "../utils/lifecycle.utils";
import { IMiniSale } from "../types/sale.types";
import {
  AccelerationUnit,
  GrowthRateUnit,
  LRegressionUnit,
  MovingAveragesUnit,
} from "../types/lifecycle.types";

const movingAveragesOfSalesService = async (
  sales: IMiniSale[],
  windowSize: number,
  weight: boolean,
): Promise<MovingAveragesUnit[]> => {
  if (windowSize > sales.length) {
    throw new ServiceError(
      StatusCodes.BAD_REQUEST,
      "Window size of moving averages can't be larger than the length of sales.",
    );
  }

  let movingAverages: MovingAveragesUnit[] = [];

  for (let i = 0; i <= sales.length - windowSize; i++) {
    let slice = sales.slice(i, i + windowSize);
    let averageAmount = weight
      ? await calculateWeightedAverageSales(slice, windowSize)
      : await calculateAverageSales(slice, windowSize);

    movingAverages.push({
      amount: averageAmount,
      timestamp: slice[slice.length - 1].createdAt,
    });
  }

  return movingAverages;
};

const growthRateService = async (
  sales: IMiniSale[],
): Promise<GrowthRateUnit[]> => {
  let growthRates: GrowthRateUnit[] = [];

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

const salesAccelerationService = async (
  growthRates: GrowthRateUnit[],
): Promise<AccelerationUnit[]> => {
  let accelerationRates: AccelerationUnit[] = [];

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

  let linearRegressionSlopes: LRegressionUnit[] = [];

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

export {
  movingAveragesOfSalesService,
  growthRateService,
  salesAccelerationService,
};
