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
  errorJsonFactory,
  successResponseFactory,
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

export const GetProductsResponse = successResponseFactory(
  SuccessEntries.PRODUCT_LISETED,
  { products: z.array(CompleteProduct) },
);

export const GetProductByIdResponse = successResponseFactory(
  SuccessEntries.PRODUCT_LISETED,
  { products: CompleteProduct },
);

export const PostProductResponse = successResponseFactory(
  SuccessEntries.PRODUCT_CREATED,
  { product: CompleteProduct },
);

export const DeleteProductByIdResponse = successResponseFactory(
  SuccessEntries.PRODUCT_DELETED,
  { deleteCount: DeleteCountResponseItem, product: CompleteProduct },
);

export const NoProductFoundError = errorJsonFactory(ErrorEntries.NO_PRODUCT);

export const ObjectIdSchema = z.string().regex(/^[a-f\d]{24}$/i);

export const ProductIDParam = z.object({
  productId: ObjectIdSchema.openapi({
    description: "Product ID",
    param: { name: "productId", in: "path" },
  }),
});
