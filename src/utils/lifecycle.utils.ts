import { StatusCodes } from "http-status-codes";
import { ServiceError } from "../errors/service.error";
import { LifecycleTypes } from "../types/lifecycle.types";
import { UnitTypes } from "../types/unit.types";
import { createMiniUnit } from "./unit.utils";
import { getWeekWithType, timeToDate } from "./time.utils";
import { Intervals } from "../types/global.types";

export function isValidInterval(value: string): value is Intervals | "instant" {
  return (
    Object.values(Intervals).includes(value as Intervals) || value === "instant"
  );
}

export const getDateOfSale = (
  miniunit: UnitTypes.IMiniUnit | UnitTypes.UnitDocument,
  date: string,
): number => {
  switch (date) {
    case "month":
      return new Date(miniunit.createdAt).getMonth();
    case "year":
      return new Date(miniunit.createdAt).getFullYear();
    case "week":
      return getWeekWithType(new Date(miniunit.createdAt), "number");
    case "full":
      return parseInt(
        timeToDate(new Date(miniunit.createdAt), "full").replace(/-/g, ""),
      );
    default:
      return -1;
  }
};

export const calculateWeightedAverageSales = async (
  slice: UnitTypes.IMiniUnit[],
  length: number,
): Promise<number> => {
  return (
    slice.reduce((acc, val, index) => {
      const weightFactor = index + 1;
      return acc + val.amount * weightFactor;
    }, 0) /
    ((length * (length + 1)) / 2)
  );
};

export const calculateAverageSales = async (
  slice: UnitTypes.IMiniUnit[],
  length: number,
): Promise<number> => {
  return slice.reduce((acc, val) => acc + val.amount, 0) / length;
};

export const calculateSalesDateInterval = async (
  sortedSales: UnitTypes.IMiniUnit[] | UnitTypes.UnitDocument[],
  interval: string,
) => {
  let tempArray = [sortedSales[0]];
  const intervalArray = [];
  let i = 0;

  while (i < sortedSales.length - 1) {
    if (
      getDateOfSale(sortedSales[i], interval) ===
      getDateOfSale(sortedSales[i + 1], interval)
    ) {
      tempArray.push(sortedSales[i + 1]);
      i++;
    } else {
      const sumOfAmounts = tempArray.reduce(
        (acc, item) => acc + item.amount,
        0,
      );
      intervalArray.push(
        createMiniUnit(
          sumOfAmounts,
          timeToDate(new Date(sortedSales[i].createdAt), interval),
        ),
      );
      tempArray = [sortedSales[i + 1]];
      i++;
    }
  }

  if (tempArray.length > 0 && sortedSales[i]) {
    const sumOfAmounts = tempArray.reduce((acc, item) => acc + item.amount, 0);
    intervalArray.push(
      createMiniUnit(
        sumOfAmounts,
        timeToDate(new Date(sortedSales[i].createdAt), interval),
      ),
    );
  }

  return intervalArray;
};

export const convertSalesDateRange = async (
  sales: UnitTypes.IMiniUnit[] | UnitTypes.UnitDocument[],
  interval: Intervals,
): Promise<UnitTypes.IMiniUnit[]> => {
  let sortedSales = sales.sort(
    (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
  );

  switch (interval) {
    case Intervals.Yearly:
      return await calculateSalesDateInterval(sortedSales, "year");
    case Intervals.Monthly:
      return await calculateSalesDateInterval(sortedSales, "month");
    case Intervals.Daily:
      return await calculateSalesDateInterval(sortedSales, "full");
    case Intervals.Weekly:
      return await calculateSalesDateInterval(sortedSales, "week");
    default:
      throw new ServiceError(
        StatusCodes.BAD_REQUEST,
        "Interval should be 'yearly', 'monthly', 'weekly', 'daily'",
      );
  }
};
