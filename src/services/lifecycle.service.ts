import { StatusCodes } from "http-status-codes";
import { ServiceError } from "../errors/service.error";
import { UnitTypes } from "../types/unit.types";
import { withController } from "../utils/with-controller";
import {
  calculateAverageSales,
  calculateWeightedAverageSales,
} from "../utils/lifecycle.utils";
import { LifecycleTypes } from "../types/lifecycle.types";

const movingAveragesOfSalesService = async (
  sales: UnitTypes.IMiniUnit[],
  windowSize: number,
  weight: boolean,
): Promise<LifecycleTypes.MovingAveragesUnit[]> => {
  if (windowSize > sales.length) {
    throw new ServiceError(
      StatusCodes.BAD_REQUEST,
      "Window size of moving averages can't be larger than the length of sales.",
    );
  }

  let movingAverages: LifecycleTypes.MovingAveragesUnit[] = [];

  for (let i = 0; i <= sales.length - windowSize; i++) {
    let slice = sales.slice(i, i + windowSize);
    let averageAmount = weight
      ? await calculateWeightedAverageSales(slice, windowSize)
      : await calculateAverageSales(slice, windowSize);

    const averageDate = new Date(
      slice.reduce((acc, val) => acc + Date.parse(val.createdAt), 0) /
        windowSize,
    ).toJSON();

    movingAverages.push({ amount: averageAmount, timestamp: averageDate });
  }

  return movingAverages;
};

const growthRateService = async (
  sales: UnitTypes.IMiniUnit[],
): Promise<LifecycleTypes.GrowthRateUnit[]> => {
  let growthRates: LifecycleTypes.GrowthRateUnit[] = [];

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

export { movingAveragesOfSalesService, growthRateService };
