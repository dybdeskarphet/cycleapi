import { getISOWeek, getISOWeekYear } from "date-fns";

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
