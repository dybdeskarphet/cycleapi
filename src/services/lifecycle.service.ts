import { StatusCodes } from "http-status-codes";
import { ServiceError } from "../errors/service.error";
import { UnitTypes } from "../types/unit.types";
import { withController } from "../utils/with-controller";

const movingAveragesOfSalesService = async (
  sales: UnitTypes.IMiniUnit[],
  windowSize: number,
): Promise<UnitTypes.IMiniUnit[]> => {
  if (windowSize <= 0) {
    throw new ServiceError(
      StatusCodes.BAD_REQUEST,
      "Window size of moving averages can't be 0 or smaller.",
    );
  }

  if (windowSize > sales.length) {
    throw new ServiceError(
      StatusCodes.BAD_REQUEST,
      "Window size of moving averages can't be larger than the length of sales.",
    );
  }

  let movingAverages: UnitTypes.IMiniUnit[] = [];

  for (let i = 0; i <= sales.length - windowSize; i++) {
    const averageAmount =
      sales.slice(i, i + windowSize).reduce((acc, val) => acc + val.amount, 0) /
      windowSize;

    const averageDate = new Date(
      sales
        .slice(i, i + windowSize)
        .reduce((acc, val) => acc + Date.parse(val.createdAt), 0) / windowSize,
    ).toJSON();

    movingAverages.push({ amount: averageAmount, createdAt: averageDate });
  }

  return movingAverages;
};

export { movingAveragesOfSalesService };
