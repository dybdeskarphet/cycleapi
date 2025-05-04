import { addWeeks, getISOWeek, getISOWeekYear, startOfISOWeek } from "date-fns";
import { Intervals } from "../enums/intervals.enum";
import { IMiniSale, SaleDocument } from "../types/sale.types";
import { ServiceError } from "../errors/service.error";
import { StatusCodes } from "http-status-codes";

export function isValidInterval(value: string): value is Intervals {
  return Object.values(Intervals).includes(value as Intervals);
}

export const errorIfInvalidInterval = async (interval: string) => {
  if (!isValidInterval(interval)) {
    throw new ServiceError(
      StatusCodes.BAD_REQUEST,
      "Interval should be 'daily', 'weekly', 'monthly', 'yearly'.",
    );
  }
};

export const getDateOfSale = (
  minisale: IMiniSale | SaleDocument,
  date: string,
): number => {
  switch (date) {
    case "month":
      return new Date(minisale.createdAt).getMonth();
    case "year":
      return new Date(minisale.createdAt).getFullYear();
    case "week":
      return getWeekWithType(new Date(minisale.createdAt), "number");
    case "full":
      return parseInt(
        timeToDate(new Date(minisale.createdAt), "full").replace(/-/g, ""),
      );
    default:
      return -1;
  }
};

export function getWeekWithType<T extends "string" | "number">(
  date: Date,
  format: T,
): T extends "string" ? string : number {
  const week = getISOWeek(date);
  const year = getISOWeekYear(date);

  if (format === "string") {
    return `${year}-W${String(week).padStart(2, "0")}` as any;
  } else {
    return parseInt(`${year}${String(week).padStart(2, "0")}`, 10) as any;
  }
}

export const convertIntervalDateToISODate = (
  intervalDate: string,
  interval: string,
) => {
  switch (interval) {
    case "weekly":
      const [year, week] = intervalDate.split("-W");
      const startOfYear = new Date(`${year}-01-01`);
      const date = addWeeks(startOfISOWeek(startOfYear), parseInt(week) - 1);
      return date.toISOString().slice(0, 10);
    case "yearly":
    case "monthly":
      return new Date(intervalDate).toISOString().slice(0, 10);
    case "daily":
      return intervalDate;
    default:
      break;
  }
};

export const timeToDate = (fullDate: Date, type: string): string => {
  switch (type) {
    case "full":
      return fullDate.toISOString().slice(0, 10);
    case "month":
      return fullDate.toISOString().slice(0, 7);
    case "year":
      return fullDate.toISOString().slice(0, 4);
    case "week":
      return getWeekWithType(new Date(fullDate), "string");
    default:
      break;
  }
  return fullDate.toISOString().slice(0, 10);
};
