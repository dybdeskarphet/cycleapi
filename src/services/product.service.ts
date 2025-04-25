import { ServiceError } from "../errors/service.error";
import { Product } from "../models/product.model";
import { Unit } from "../models/unit.model";
import { ProductTypes } from "../types/product.types";
import mongoose, { Types } from "mongoose";

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
  if (!result) {
    throw new ServiceError(404, "Couldn't find any product(s).");
  }

  return result;
};

const postNewSaleService = async (
  productId: string,
  unitProps: Record<string, any>,
) => {
  const product = await Product.findById(productId).exec();
  if (!product) {
    throw new ServiceError(404, "Couldn't find any product(s).");
  }

  // TODO: Use the productId in `new Unit()` instead of needing in it in a body
  const unit = new Unit({ product: productId, ...unitProps });
  await unit.save();
  product.sales.push(unit._id as mongoose.Types.ObjectId);
  await product.save();
};

export { createProductService, getProductService, postNewSaleService };
