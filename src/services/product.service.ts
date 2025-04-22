import { ServiceError } from "../errors/service.error";
import { Product } from "../models/product.model";
import { ProductTypes } from "../types/product.types";

// TODO: This is not finished yet, test it.
const createProductService = async (product: ProductTypes.ProductInput) => {
  if (!product) {
    throw new ServiceError(400, "Product details are needed.");
  }

  const newProduct = new Product(product);
  await newProduct.save();

  return newProduct;
};

export { createProductService };
