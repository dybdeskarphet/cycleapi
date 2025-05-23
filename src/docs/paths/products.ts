import {
  extendZodWithOpenApi,
  RouteConfig,
} from "@asteasolutions/zod-to-openapi";
import { ErrorEntries } from "../../constants/messages.constants";
import {
  DeleteProductByIdResponse,
  GetProductByIdResponse,
  GetProductsResponse,
  NoProductFoundError,
  PostProductResponse,
  ProductIDParam,
} from "../components/products";
import {
  ProductFilterBody,
  ProductRequestBody,
} from "../../types/product.types";
import { z } from "zod";
import {
  BadRequestZod,
  bodyRequestFactory,
  errorResponseFactory,
} from "../utils";

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
    body: bodyRequestFactory(ProductRequestBody.Zod),
  },
  responses: {
    201: PostProductResponse,
    400: errorResponseFactory(ErrorEntries.INVALID_PARAMETERS, BadRequestZod),
  },
};

export const filterProductDocument: RouteConfig = {
  method: "post",
  path: "/products/filter",
  summary: "Get products by property filtering",
  tags: ["Products"],
  request: {
    body: bodyRequestFactory(ProductFilterBody.Zod),
  },
  responses: {
    200: GetProductsResponse,
    400: errorResponseFactory(ErrorEntries.INVALID_PARAMETERS, BadRequestZod),
  },
};

export const getProductByIdDocument: RouteConfig = {
  method: "get",
  path: "/products/{productId}",
  summary: "Get product by its ID",
  tags: ["Products"],
  request: {
    params: ProductIDParam,
  },
  responses: {
    200: GetProductByIdResponse,
    404: errorResponseFactory(ErrorEntries.NO_PRODUCT, NoProductFoundError),
  },
};

export const deleteProductByIdDocument: RouteConfig = {
  method: "delete",
  path: "/products/{productId}",
  summary: "Delete a product by its ID",
  tags: ["Products"],
  request: {
    params: ProductIDParam,
  },
  responses: {
    200: DeleteProductByIdResponse,
    404: errorResponseFactory(ErrorEntries.NO_PRODUCT, NoProductFoundError),
  },
};
