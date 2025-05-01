import { UnitTypes } from "../types/unit.types";
import { Unit } from "../models/unit.model";
import { StatusCodes } from "http-status-codes";
import { ServiceError } from "../errors/service.error";
import { validateAndReturnObjectId } from "../utils/mongoose.utils";
import { ProductTypes } from "../types/product.types";
import { Types } from "mongoose";

const getSaleByIdService = async (
  id: string,
): Promise<UnitTypes.UnitDocument> => {
  const sale = await Unit.findById(validateAndReturnObjectId(id)).exec();
  if (!sale || !(sale instanceof Unit)) {
    throw new ServiceError(
      StatusCodes.NOT_FOUND,
      "Couldn't find any sale by this ID.",
    );
  }

  return sale;
};

const createSaleService = async (
  product: ProductTypes.ProductDocument,
  unitProps: Record<string, any>,
) => {
  const unit = new Unit({ product: product._id, ...unitProps });
  await unit.save();

  product.sales.push(unit._id as Types.ObjectId);
  await product.save();
};

const deleteSaleService = async (
  product: ProductTypes.ProductDocument,
  sale: UnitTypes.UnitDocument,
) => {
  const deleteResult = await Unit.deleteOne({
    _id: sale._id,
  });

  if (deleteResult.deletedCount > 0) {
    product.sales = product.sales.filter((id) => {
      if (!(id instanceof Types.ObjectId)) {
        console.error(
          "deleteSaleService: Don't populate the sales field of the product in the controller.",
        );
        throw new ServiceError(
          StatusCodes.INTERNAL_SERVER_ERROR,
          "Internal server error.",
        );
      }
      return !(id as Types.ObjectId).equals(sale._id);
    });
    await product.save();
  }

  return deleteResult.deletedCount;
};

export { getSaleByIdService, createSaleService, deleteSaleService };
