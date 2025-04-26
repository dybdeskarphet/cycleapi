import { ServiceError } from "../errors/service.error";
import { Product } from "../models/product.model";
import { ProductTypes } from "../types/product.types";
import mongoose, { DeleteResult, Error } from "mongoose";
import { validateAndReturnObjectId } from "../utils/id-validator";
import { UnitTypes } from "../types/unit.types";
import { Unit } from "../models/unit.model";
import { StatusCodes } from "http-status-codes";

const getProductService = async (filters: Record<string, any> = {}) => {
  const result = await Product.find(filters).exec();
  if (!result) {
    throw new ServiceError(
      StatusCodes.NOT_FOUND,
      "Couldn't find any product(s).",
    );
  }

  return result;
};

const getProductByIdService = async (
  id: string,
): Promise<ProductTypes.ProductDocument> => {
  const product = await Product.findById(validateAndReturnObjectId(id)).exec();
  if (!product || !(product instanceof Product)) {
    throw new ServiceError(
      StatusCodes.NOT_FOUND,
      "Couldn't find any product by this ID.",
    );
  }

  return product;
};

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

const createProductService = async (
  productInput: ProductTypes.ProductInput,
) => {
  if (!productInput) {
    throw new ServiceError(
      StatusCodes.BAD_REQUEST,
      "Product details are needed.",
    );
  }

  const newProduct = new Product(productInput);
  await newProduct.save();

  return newProduct;
};

const deleteProductService = async (product: ProductTypes.ProductDocument) => {
  return (
    await Product.deleteOne({
      _id: product._id,
    })
  ).deletedCount;
};

const createSaleService = async (
  product: ProductTypes.ProductDocument,
  unitProps: Record<string, any>,
) => {
  const unit = new Unit({ product: product._id, ...unitProps });
  await unit.save();

  product.sales.push(unit._id as mongoose.Types.ObjectId);
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
    product.sales = product.sales.filter((id) => !id.equals(sale._id));
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
  deleteProductService,
};
