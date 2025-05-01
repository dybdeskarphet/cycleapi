import { ServiceError } from "../errors/service.error";
import { Product } from "../models/product.model";
import { ProductDocument, ProductInput } from "../types/product.types";
import { validateAndReturnObjectId } from "../utils/mongoose.utils";
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
  populateFields: string[] = [],
): Promise<ProductDocument> => {
  const product = await Product.findById(validateAndReturnObjectId(id))
    .populate(populateFields)
    .exec();
  if (!product || !(product instanceof Product)) {
    throw new ServiceError(
      StatusCodes.NOT_FOUND,
      "Couldn't find any product by this ID.",
    );
  }

  return product;
};

const createProductService = async (productInput: ProductInput) => {
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

const deleteProductService = async (product: ProductDocument) => {
  return (
    await Product.deleteOne({
      _id: product._id,
    })
  ).deletedCount;
};

export {
  createProductService,
  getProductService,
  getProductByIdService,
  deleteProductService,
};
