import { StatusCodes } from "http-status-codes";
import { ServiceError } from "../errors/service.error";
import { Intervals } from "../enums/intervals.enum";
import { IMiniSale, ISale, SaleDocument } from "../types/sale.types";
import { getDateOfSale, timeToDate } from "./time.utils";

export const sortSalesByTime = (sales: SaleDocument[]) => {
  return sales.sort(
    (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
  );
};

export const createMiniSale = (
  amount: ISale["amount"],
  createdAt: string,
): IMiniSale => {
  return {
    amount,
    createdAt,
  };
};

export const calculateSalesDateInterval = async (
  sortedSales: IMiniSale[] | SaleDocument[],
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
        createMiniSale(
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
      createMiniSale(
        sumOfAmounts,
        timeToDate(new Date(sortedSales[i].createdAt), interval),
      ),
    );
  }

  return intervalArray;
};

export const convertSalesDateRange = async (
  sales: IMiniSale[] | SaleDocument[],
  interval: Intervals,
): Promise<IMiniSale[]> => {
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
