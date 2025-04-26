import { ServiceError } from "../errors/service.error";
import { Product } from "../models/product.model";
import { ProductTypes } from "../types/product.types";
import mongoose, { DeleteResult, Error } from "mongoose";
import { validateAndReturnObjectId } from "../utils/id-validator";
import { UnitTypes } from "../types/unit.types";
import { Unit } from "../models/unit.model";

const getProductService = async (filters: Record<string, any> = {}) => {
  const result = await Product.find(filters).exec();
  if (!result) {
    throw new ServiceError(404, "Couldn't find any product(s).");
  }

  return result;
};

const getProductByIdService = async (
  id: string,
): Promise<ProductTypes.IProduct> => {
  const product = await Product.findById(validateAndReturnObjectId(id)).exec();
  if (!product || !(product instanceof Product)) {
    throw new ServiceError(404, "Couldn't find any product by this ID.");
  }

  return product;
};

const getSaleByIdService = async (id: string): Promise<UnitTypes.IUnit> => {
  const sale = await Unit.findById(validateAndReturnObjectId(id)).exec();
  if (!sale || !(sale instanceof Unit)) {
    throw new ServiceError(404, "Couldn't find any sale by this ID.");
  }

  return sale;
};

const createProductService = async (product: ProductTypes.ProductInput) => {
  if (!product) {
    throw new ServiceError(400, "Product details are needed.");
  }

  const newProduct = new Product(product);
  await newProduct.save();

  return newProduct;
};

const createSaleService = async (
  product: ProductTypes.IProduct,
  unitProps: Record<string, any>,
) => {
  const unit = new Unit({ product: product._id, ...unitProps });
  await unit.save();

  product.sales.push(unit._id as mongoose.Types.ObjectId);
  await product.save();
};

const deleteSaleService = async (
  product: ProductTypes.IProduct,
  saleId: string,
) => {
  const deleteResult = await Unit.deleteOne({
    _id: validateAndReturnObjectId(saleId),
  });

  if (deleteResult.deletedCount > 0) {
    product.sales = product.sales.filter(
      (id) => !id.equals(validateAndReturnObjectId(saleId)),
    );
    await product.save();
  }

  return deleteResult.deletedCount;
};

export {
  createProductService,
  getProductService,
  createSaleService,
  getProductByIdService,
  getSaleByIdService,
  deleteSaleService,
};
