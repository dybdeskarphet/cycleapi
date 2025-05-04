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
  const mean_y = await calculateAverageSales(sales, sales.length);
  const mean_x = sales.reduce((acc, val) => {
    const currentDate = differenceInDays(
      parseISO(convertIntervalDateToISODate(val.createdAt, interval) as string),
      parseISO(
        convertIntervalDateToISODate(sales[0].createdAt, interval) as string,
      ),
    );
    return acc + currentDate;
  }, 0);

  const sxx = sales.reduce((acc, val) => {
    const currentDate = differenceInDays(
      parseISO(convertIntervalDateToISODate(val.createdAt, interval) as string),
      parseISO(
        convertIntervalDateToISODate(sales[0].createdAt, interval) as string,
      ),
    );

    console.log(currentDate);

    return acc + Math.pow(currentDate - mean_x, 2);
  }, 0);

  const sxy = sales.reduce((acc, val) => {
    const currentDate = differenceInDays(
      parseISO(convertIntervalDateToISODate(val.createdAt, interval) as string),
      parseISO(
        convertIntervalDateToISODate(sales[0].createdAt, interval) as string,
      ),
    );
    return (currentDate - mean_x) * (val.amount - mean_y) + acc;
  }, 0);

  return sxy / sxx;
};
