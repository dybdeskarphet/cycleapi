import { ServiceError } from "../errors/service.error";
import { Product } from "../models/product.model";
import { Unit } from "../models/unit.model";
import { ProductTypes } from "../types/product.types";
import mongoose, { DeleteResult, Error } from "mongoose";
import { validateAndReturnObjectId } from "../utils/id-validator";

// TODO: This is not finished yet, test it.
const createProductService = async (product: ProductTypes.ProductInput) => {
  if (!product) {
    throw new ServiceError(400, "Product details are needed.");
  }

  const newProduct = new Product(product);
  await newProduct.save();

  return newProduct;
};

const getProductService = async (filters: Record<string, any> = {}) => {
  const result = await Product.find(filters).exec();
  if (!result || !(result instanceof Product)) {
    throw new ServiceError(404, "Couldn't find any product(s).");
  }

  return result;
};

const createSaleService = async (
  productId: string,
  unitProps: Record<string, any>,
) => {
  const validProductId = validateAndReturnObjectId(productId);
  const product = await getProductService({ _id: validProductId });

  const unit = new Unit({ product: productId, ...unitProps });
  await unit.save();
  product.sales.push(unit._id as mongoose.Types.ObjectId);
  await product.save();
};

export { createProductService, getProductService, createSaleService };
