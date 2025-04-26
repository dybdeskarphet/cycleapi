import { ServiceError } from "../errors/service.error";
import { Product } from "../models/product.model";
import { Unit } from "../models/unit.model";
import { ProductTypes } from "../types/product.types";
import mongoose, { DeleteResult, Error } from "mongoose";
import { validateAndReturnObjectId } from "../utils/id-validator";

const getProductService = async (filters: Record<string, any> = {}) => {
  const result = await Product.find(filters).exec();
  if (!result) {
    throw new ServiceError(404, "Couldn't find any product(s).");
  }

  return result;
};

const getSaleService = async (filters: Record<string, any> = {}) => {
  const result = await Unit.find(filters).exec();
  if (!result || !(result instanceof Product)) {
    throw new ServiceError(404, "Couldn't find any sale(s).");
  }

  return result;
};

const getProductByIdService = async (id: string) => {
  const product = await Product.findById(validateAndReturnObjectId(id)).exec();
  if (!product) {
    throw new ServiceError(404, "Couldn't find any product by this ID.");
  }

  return product;
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
  productId: string,
  unitProps: Record<string, any>,
) => {
  const product = await getProductByIdService(productId);

  const unit = new Unit({ product: productId, ...unitProps });
  await unit.save();

  product.sales.push(unit._id as mongoose.Types.ObjectId);
  await product.save();
};

const deleteSaleService = async (productId: string, saleId: string) => {
  const product = await getProductByIdService(productId);
  const sale = await getSaleService({ _id: saleId });

  Unit.deleteOne({ _id: saleId }, (err: Error, result: DeleteResult) => {
    if (err) {
      throw new ServiceError(
        500,
        "Could not perform delete action due to server error.",
      );
    } else {
      product.sales = product.sales.filter(
        (id) => id === validateAndReturnObjectId(saleId),
      );
      product.save();
    }
  });

  return sale;
};

export {
  createProductService,
  getProductService,
  createSaleService,
  getProductByIdService,
  deleteSaleService,
};
