import { ServiceError } from "../errors/service.error";
import { Product } from "../models/product.model";
import {
  ProductDocument,
  ProductPopulatableFields,
  ProductRequestBody,
  ZodProductPopulatableFields,
} from "../types/product.types";
import { handleZodParsed } from "../utils/express.utils";
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
  populateFields: ProductPopulatableFields = [],
): Promise<ProductDocument> => {
  const populatable = handleZodParsed(
    ZodProductPopulatableFields.safeParse(populateFields),
  );

  const product = await Product.findById(validateAndReturnObjectId(id))
    .populate(populatable)
    .exec();

  if (!product || !(product instanceof Product)) {
    throw new ServiceError(
      StatusCodes.NOT_FOUND,
      "Couldn't find any product by this ID.",
    );
  }

  return product;
};

const createProductService = async (productRequestBody: ProductRequestBody) => {
  const newProduct = new Product(productRequestBody);
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
