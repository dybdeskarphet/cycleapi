import { StatusCodes } from "http-status-codes";
import { ApiError } from "../errors/api.error";
import { validateAndReturnObjectId } from "../utils/mongoose.utils";
import { Types } from "mongoose";
import {
  RestoreSaleInputArraySchemaType,
  RestoreSaleInputSchemaType,
  SaleDocument,
  SaleRequestBody,
} from "../types/sale.types";
import { Sale } from "../models/sale.model";
import { ProductDocument } from "../types/product.types";
import { ErrorEntries } from "../constants/messages.constants";

export const getSaleByIdService = async (id: string): Promise<SaleDocument> => {
  const sale = await Sale.findById(validateAndReturnObjectId(id)).exec();

  if (!sale || !(sale instanceof Sale)) {
    throw new ApiError(StatusCodes.NOT_FOUND, ErrorEntries.NO_SALE);
  }

  return sale;
};

export const createSaleService = async (
  product: ProductDocument,
  requestBody: SaleRequestBody,
) => {
  const unit = new Sale({ product: product._id, ...requestBody });
  await unit.save();

  product.sales.push(unit._id as Types.ObjectId);
  await product.save();
  return unit;
};

export const deleteSaleService = async (
  product: ProductDocument,
  sale: SaleDocument,
) => {
  const deleteResult = await Sale.deleteOne({
    _id: sale._id,
  });

  if (deleteResult.deletedCount > 0) {
    product.sales = product.sales.filter((id) => {
      if (!(id instanceof Types.ObjectId)) {
        console.error(
          "deleteSaleService: Don't populate the sales field of the product in the controller.",
        );
        throw new ApiError(
          StatusCodes.INTERNAL_SERVER_ERROR,
          ErrorEntries.INTERNAL_SERVER_ERROR,
        );
      }
      return !(id as Types.ObjectId).equals(sale._id);
    });
    await product.save();
  }

  return deleteResult.deletedCount;
};

export const deleteAllSalesAndRestoreService = async (
  product: ProductDocument,
  saleInputs: RestoreSaleInputArraySchemaType,
) => {
  await Sale.deleteMany({ _id: { $in: product.sales } });
  const newSalesWithProductId = saleInputs.map((sale) => ({
    product: product._id,
    ...sale,
  }));

  const newSales = await Sale.insertMany(newSalesWithProductId);

  product.sales = newSales.map((sale) => sale._id);
  product.save();

  return product.sales;
};
