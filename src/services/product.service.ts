import { ServiceError } from "../errors/service.error";
import { Product } from "../models/product.model";
import { ProductTypes } from "../types/product.types";
import { Types } from "mongoose";

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
  const result = Product.find(filters).exec();
  if (result) {
    return result;
  } else {
    throw new ServiceError(404, "Couldn't find any product(s).");
  }
};

export { createProductService, getProductService };
