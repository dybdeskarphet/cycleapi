import { StatusCodes } from "http-status-codes";
import { ServiceError } from "../errors/service.error";
import {
  calculateAverageSales,
  calculateWeightedAverageSales,
} from "../utils/lifecycle.utils";
import { IMiniSale } from "../types/sale.types";
import {
  AccelerationUnit,
  GrowthRateUnit,
  MovingAveragesUnit,
} from "../types/lifecycle.types";

// TODO: Add interval option to all of the below services and change how the controller works.

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

    const averageDate = new Date(
      slice.reduce((acc, val) => acc + Date.parse(val.createdAt), 0) /
        windowSize,
    ).toJSON();

    movingAverages.push({
      amount: averageAmount,
      timestamp: slice[slice.length - 1].createdAt,
    });
  }

  return movingAverages;
};

// TODO: Add monthly and weekly growth rate calculation parameter
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

export {
  movingAveragesOfSalesService,
  growthRateService,
  salesAccelerationService,
};
