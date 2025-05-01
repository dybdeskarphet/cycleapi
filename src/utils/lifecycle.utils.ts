import { IMiniSale } from "../types/sale.types";

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
