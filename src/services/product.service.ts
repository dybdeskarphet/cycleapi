import { ErrorEntries } from "../constants/messages.constants";
import { ApiError } from "../errors/api.error";
import { Product } from "../models/product.model";
import {
  ProductDocument,
  ProductFilterBody,
  ProductPopulatableFields,
  ProductRequestBody,
  ZodProductPopulatableFields,
} from "../types/product.types";
import { handleZodParsed } from "../utils/express.utils";
import { validateAndReturnObjectId } from "../utils/mongoose.utils";
import { StatusCodes } from "http-status-codes";

const getProductService = async (filters: ProductFilterBody.TS = {}) => {
  const result = await Product.find(filters).exec();
  if (!result) {
    throw new ApiError(StatusCodes.NOT_FOUND, ErrorEntries.NO_PRODUCT);
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
    throw new ApiError(StatusCodes.NOT_FOUND, ErrorEntries.NO_PRODUCT);
  }

  return product;
};

const createProductService = async (
  productRequestBody: ProductRequestBody.TS,
) => {
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
