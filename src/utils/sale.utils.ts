import { StatusCodes } from "http-status-codes";
import { ApiError } from "../errors/api.error";
import { Intervals } from "../enums/intervals.enum";
import { IMiniSale, ISale, SaleDocument } from "../types/sale.types";
import { getDateOfSale, timeToDate } from "./time.utils";
import { ErrorEntries } from "../constants/messages.constants";

export const sortSalesByTime = (sales: SaleDocument[]) => {
  return sales.sort(
    (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
  );
};

export const createMiniSale = (
  amount: ISale["amount"],
  createdAt: string,
): IMiniSale.TS => {
  return {
    amount,
    createdAt,
  };
};

export const calculateSalesDateInterval = async (
  sortedSales: IMiniSale.TS[] | SaleDocument[],
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
  sales: IMiniSale.TS[] | SaleDocument[],
  interval: Intervals,
): Promise<IMiniSale.TS[]> => {
  let sortedSales = sales.sort(
    (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
  );

  let intervalToTimeUnit = "";

  switch (interval) {
    case Intervals.Yearly:
      intervalToTimeUnit = "year";
      break;
    case Intervals.Monthly:
      intervalToTimeUnit = "month";
      break;
    case Intervals.Daily:
      intervalToTimeUnit = "full";
      break;
    case Intervals.Weekly:
      intervalToTimeUnit = "week";
      break;
  }

  if (intervalToTimeUnit !== "") {
    return await calculateSalesDateInterval(sortedSales, intervalToTimeUnit);
  } else {
    throw new ApiError(StatusCodes.BAD_REQUEST, ErrorEntries.INVALID_INTERVAL);
  }
};
