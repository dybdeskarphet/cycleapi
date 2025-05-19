import {
  extendZodWithOpenApi,
  RouteConfig,
} from "@asteasolutions/zod-to-openapi";
import {
  ErrorEntries,
  SuccessEntries,
} from "../../constants/messages.constants";
import { NoProductFoundError, ObjectIdSchema } from "../components/products";
import {
  CompleteSale,
  DeleteSaleByIdResponse,
  GetSalesResponse,
  NoSaleFoundError,
  PostSaleResponse,
  PostSaleRestoreResponse,
} from "../components/sales";
import { IntervalsWithInstantSchema } from "../../enums/intervals.enum";
import { z } from "zod";
import { ZodSaleRequestBody } from "../../types/sale.types";
import { BadRequestZod, errorResponseFactory } from "../utils";

extendZodWithOpenApi(z);

export const getSalesByIntervalDocument: RouteConfig = {
  method: "get",
  path: "/products/{productId}/sales/{interval}",
  summary: "Get sales by an interval",
  tags: ["Sales"],
  request: {
    params: z.object({
      productId: ObjectIdSchema.openapi({
        param: { name: "productId", in: "path" },
      }),
      interval: IntervalsWithInstantSchema.openapi({
        param: { name: "interval", in: "path" },
      }),
    }),
  },
  responses: {
    200: GetSalesResponse,
    404: errorResponseFactory(ErrorEntries.NO_PRODUCT, NoProductFoundError),
  },
};

export const postSaleDocument: RouteConfig = {
  method: "post",
  path: "/products/{productId}/sales",
  summary: "Add a new sale by the product ID",
  tags: ["Sales"],
  request: {
    body: {
      content: {
        "application/json": {
          schema: ZodSaleRequestBody,
        },
      },
      required: true,
    },
    params: z.object({
      productId: ObjectIdSchema.openapi({
        param: { name: "productId", in: "path" },
      }),
    }),
  },
  responses: {
    201: PostSaleResponse,
    404: errorResponseFactory(ErrorEntries.NO_PRODUCT, NoProductFoundError),
    400: errorResponseFactory(ErrorEntries.ZOD_ERROR, BadRequestZod),
  },
};

export const postRestoreSalesDocument: RouteConfig = {
  method: "put",
  path: "/products/{productId}/sales/restore",
  summary: "Restore old sales for a product",
  tags: ["Sales"],
  request: {
    body: {
      content: {
        "application/json": {
          schema: z.array(CompleteSale),
        },
      },
      required: true,
    },
    params: z.object({
      productId: ObjectIdSchema.openapi({
        param: { name: "productId", in: "path" },
      }),
    }),
  },
  responses: {
    200: PostSaleRestoreResponse,
    404: errorResponseFactory(ErrorEntries.NO_PRODUCT, NoProductFoundError),
    400: errorResponseFactory(ErrorEntries.ZOD_ERROR, BadRequestZod),
  },
};

export const deleteSaleByIdDocument: RouteConfig = {
  method: "delete",
  path: "/products/{productId}/sales/{saleId}",
  summary: "Delete a sale by its ID",
  tags: ["Sales"],
  request: {
    params: z.object({
      productId: ObjectIdSchema.openapi({
        param: { name: "productId", in: "path" },
      }),
      saleId: ObjectIdSchema.openapi({ param: { name: "saleId", in: "path" } }),
    }),
  },
  responses: {
    200: DeleteSaleByIdResponse,
    404: errorResponseFactory(
      "Product or sale not found.",
      z.union([NoProductFoundError, NoSaleFoundError]),
    ),
  },
};
