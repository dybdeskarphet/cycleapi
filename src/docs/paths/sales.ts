import { RouteConfig } from "@asteasolutions/zod-to-openapi";
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
import { BadRequestZod } from "../utils";

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
    200: {
      description: SuccessEntries.SALE_LISTED.message,
      content: {
        "application/json": {
          schema: GetSalesResponse,
        },
      },
    },
    404: {
      description: ErrorEntries.NO_PRODUCT.message,
      content: {
        "application/json": {
          schema: NoProductFoundError,
        },
      },
    },
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
    201: {
      description: SuccessEntries.PRODUCT_CREATED.message,
      content: {
        "application/json": {
          schema: PostSaleResponse,
        },
      },
    },
    400: {
      description: ErrorEntries.ZOD_ERROR.message,
      content: {
        "application/json": {
          schema: BadRequestZod,
        },
      },
    },
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
    200: {
      description: SuccessEntries.SALE_RESTORED.message,
      content: {
        "application/json": {
          schema: PostSaleRestoreResponse,
        },
      },
    },
    400: {
      description: ErrorEntries.ZOD_ERROR.message,
      content: {
        "application/json": {
          schema: BadRequestZod,
        },
      },
    },
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
    200: {
      description: SuccessEntries.PRODUCT_DELETED.message,
      content: {
        "application/json": {
          schema: DeleteSaleByIdResponse,
        },
      },
    },
    404: {
      description: ErrorEntries.NO_PRODUCT.message,
      content: {
        "application/json": {
          schema: z.union([NoProductFoundError, NoSaleFoundError]),
        },
      },
    },
  },
};
