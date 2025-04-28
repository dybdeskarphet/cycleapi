import { StatusCodes } from "http-status-codes";
import { ServiceError } from "../errors/service.error";
import { UnitTypes } from "../types/unit.types";
import { withController } from "../utils/with-controller";
import {
  calculateAverageSales,
  calculateWeightedAverageSales,
} from "../utils/lifecycle.utils";

const movingAveragesOfSalesService = async (
  sales: UnitTypes.IMiniUnit[],
  windowSize: number,
  weight: boolean,
): Promise<UnitTypes.IMiniUnit[]> => {
  if (windowSize > sales.length) {
    throw new ServiceError(
      StatusCodes.BAD_REQUEST,
      "Window size of moving averages can't be larger than the length of sales.",
    );
  }

  let movingAverages: UnitTypes.IMiniUnit[] = [];

  for (let i = 0; i <= sales.length - windowSize; i++) {
    let slice = sales.slice(i, i + windowSize);
    let averageAmount = weight
      ? await calculateWeightedAverageSales(slice, windowSize)
      : await calculateAverageSales(slice, windowSize);

    const averageDate = new Date(
      slice.reduce((acc, val) => acc + Date.parse(val.createdAt), 0) /
        windowSize,
    ).toJSON();

    movingAverages.push({ amount: averageAmount, createdAt: averageDate });
  }

  return movingAverages;
};

export { movingAveragesOfSalesService };
