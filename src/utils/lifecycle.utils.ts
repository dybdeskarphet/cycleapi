import { differenceInDays, parseISO } from "date-fns";
import { IMiniSale } from "../types/sale.types";
import { convertIntervalDateToISODate } from "./time.utils";

export const calculateWeightedAverageSales = async (
  slice: IMiniSale[],
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
  slice: IMiniSale[],
  length: number,
): Promise<number> => {
  return slice.reduce((acc, val) => acc + val.amount, 0) / length;
};

// TODO: You can just use a single for loop
export const getLinearRegressionSlopeOfSales = async (
  sales: IMiniSale[],
  interval: string,
) => {
  let mean_x = 0;
  let mean_y = 0;
  let sxx = 0;
  let sxy = 0;

  for (let i = 0; i < sales.length; i++) {
    const currentDate = differenceInDays(
      parseISO(
        convertIntervalDateToISODate(sales[i].createdAt, interval) as string,
      ),
      parseISO(
        convertIntervalDateToISODate(sales[0].createdAt, interval) as string,
      ),
    );

    mean_y += sales[i].amount;
    mean_x += currentDate;
  }

  mean_x = mean_x / sales.length;
  mean_y = mean_y / sales.length;

  for (let i = 0; i < sales.length; i++) {
    const currentDate = differenceInDays(
      parseISO(
        convertIntervalDateToISODate(sales[i].createdAt, interval) as string,
      ),
      parseISO(
        convertIntervalDateToISODate(sales[0].createdAt, interval) as string,
      ),
    );

    sxx += Math.pow(currentDate - mean_x, 2);
    sxy += (currentDate - mean_x) * (sales[i].amount - mean_y);
  }

  return sxy / sxx;
};
