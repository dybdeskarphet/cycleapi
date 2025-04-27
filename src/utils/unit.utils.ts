import { ProductTypes } from "../types/product.types";
import { UnitTypes } from "../types/unit.types";

export const timeToDate = (fullDate: Date) => {
  return fullDate.toISOString().slice(0, 10);
};

export const sortSalesByTime = (sales: UnitTypes.UnitDocument[]) => {
  return sales.sort(
    (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
  );
};

export const createMiniUnit = (
  amount: UnitTypes.IUnit["amount"],
  createdAt: string,
): UnitTypes.IMiniUnit => {
  return {
    amount,
    createdAt,
  };
};
