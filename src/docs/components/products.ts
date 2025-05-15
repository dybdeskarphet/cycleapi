import { z, ZodRawShape } from "zod";
import {
  SuccessEntries,
  ErrorEntries,
} from "../../constants/messages.constants";
import { Types } from "mongoose";
import { ZodIProduct } from "../../types/product.types";
import { extendZodWithOpenApi } from "@asteasolutions/zod-to-openapi";
import {
  DeleteCountResponseItem,
  documentErrorFactory,
  documentSuccessFactory,
} from "../utils";
extendZodWithOpenApi(z);

export const CompleteProduct = z
  .object({
    _id: z.instanceof(Types.ObjectId),
  })
  .merge(ZodIProduct)
  .extend({
    createdAt: z.date(),
    updatedAt: z.date(),
    __v: z.number().default(0),
  });

export const GetProductsResponse = documentSuccessFactory(
  SuccessEntries.PRODUCT_LISETED,
  { products: z.array(CompleteProduct) },
);

export const GetProductByIdResponse = documentSuccessFactory(
  SuccessEntries.PRODUCT_LISETED,
  { products: CompleteProduct },
);

export const PostProductResponse = documentSuccessFactory(
  SuccessEntries.PRODUCT_CREATED,
  { product: CompleteProduct },
);

export const DeleteProductByIdResponse = documentSuccessFactory(
  SuccessEntries.PRODUCT_DELETED,
  { deleteCount: DeleteCountResponseItem, product: CompleteProduct },
);

export const NoProductFoundError = documentErrorFactory(
  ErrorEntries.NO_PRODUCT,
);

export const ObjectIdSchema = z.string().regex(/^[a-f\d]{24}$/i);
