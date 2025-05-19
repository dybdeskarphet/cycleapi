import {
  extendZodWithOpenApi,
  RouteConfig,
} from "@asteasolutions/zod-to-openapi";
import {
  ErrorEntries,
  SuccessEntries,
} from "../../constants/messages.constants";
import {
  DeleteProductByIdResponse,
  GetProductByIdResponse,
  GetProductsResponse,
  NoProductFoundError,
  ObjectIdSchema,
  PostProductResponse,
} from "../components/products";
import {
  ZodProductFilterBody,
  ZodProductRequestBody,
} from "../../types/product.types";
import { z } from "zod";
import { BadRequestZod, errorResponseFactory } from "../utils";

extendZodWithOpenApi(z);

export const getProductsDocument: RouteConfig = {
  method: "get",
  path: "/products",
  summary: "Get all the products",
  tags: ["Products"],
  responses: {
    200: GetProductsResponse,
    404: errorResponseFactory(ErrorEntries.NO_PRODUCT, NoProductFoundError),
  },
};

export const postProductDocument: RouteConfig = {
  method: "post",
  path: "/products",
  summary: "Add a new product to the DB",
  tags: ["Products"],
  request: {
    body: {
      content: {
        "application/json": {
          schema: ZodProductRequestBody,
        },
      },
      required: true,
    },
  },
  responses: {
    201: PostProductResponse,
    400: errorResponseFactory(ErrorEntries.ZOD_ERROR, BadRequestZod),
  },
};

export const filterProductDocument: RouteConfig = {
  method: "post",
  path: "/products/filter",
  summary: "Get products by property filtering",
  tags: ["Products"],
  request: {
    body: {
      content: {
        "application/json": {
          schema: ZodProductFilterBody,
        },
      },
      required: true,
    },
  },
  responses: {
    200: GetProductsResponse,
    400: errorResponseFactory(ErrorEntries.ZOD_ERROR, BadRequestZod),
  },
};

export const getProductByIdDocument: RouteConfig = {
  method: "get",
  path: "/products/{id}",
  summary: "Get product by its ID",
  tags: ["Products"],
  request: {
    params: z.object({
      id: ObjectIdSchema.openapi({ param: { name: "id", in: "path" } }),
    }),
  },
  responses: {
    200: GetProductByIdResponse,
    404: errorResponseFactory(ErrorEntries.NO_PRODUCT, NoProductFoundError),
  },
};

export const deleteProductByIdDocument: RouteConfig = {
  method: "delete",
  path: "/products/{id}",
  summary: "Delete a product by its ID",
  tags: ["Products"],
  request: {
    params: z.object({
      id: ObjectIdSchema.openapi({ param: { name: "id", in: "path" } }),
    }),
  },
  responses: {
    200: DeleteProductByIdResponse,
    404: errorResponseFactory(ErrorEntries.NO_PRODUCT, NoProductFoundError),
  },
};
