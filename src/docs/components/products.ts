import { z } from "zod";
import {
  SuccessEntries,
  ErrorEntries,
} from "../../constants/messages.constants";
import { extendZodWithOpenApi } from "@asteasolutions/zod-to-openapi";
import {
  DeleteCountResponseItem,
  errorJsonFactory,
  successResponseFactory,
} from "../utils";
import { ZodIProduct } from "../../types/product.types";
import { ObjectIdSchema } from "./global";
import { ObjectIdWithOpenapi, DateWithOpenapi } from "../../types/global.types";

extendZodWithOpenApi(z);

export const CompleteProduct = z
  .object({
    _id: ObjectIdWithOpenapi,
  })
  .merge(ZodIProduct)
  .extend({
    createdAt: DateWithOpenapi,
    updatedAt: DateWithOpenapi,
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

export const ProductIDParam = z.object({
  productId: ObjectIdSchema.openapi({
    description: "Product ID",
    param: { name: "productId", in: "path" },
  }),
});
