import {
  extendZodWithOpenApi,
  RouteConfig,
} from "@asteasolutions/zod-to-openapi";
import { ErrorEntries } from "../../constants/messages.constants";
import { NoProductFoundError, ProductIDParam } from "../components/products";
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
import { SaleRequestBody } from "../../types/sale.types";
import {
  BadRequestZod,
  bodyRequestFactory,
  errorResponseFactory,
} from "../utils";
import { ObjectIdSchema } from "../components/global";

extendZodWithOpenApi(z);

export const getSalesByIntervalDocument: RouteConfig = {
  method: "get",
  path: "/products/{productId}/sales/{interval}",
  summary: "Get sales by an interval",
  tags: ["Sales"],
  request: {
    params: ProductIDParam.extend({
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
    body: bodyRequestFactory(SaleRequestBody.Zod),
    params: ProductIDParam,
  },
  responses: {
    201: PostSaleResponse,
    404: errorResponseFactory(ErrorEntries.NO_PRODUCT, NoProductFoundError),
    400: errorResponseFactory(ErrorEntries.INVALID_PARAMETERS, BadRequestZod),
  },
};

export const postRestoreSalesDocument: RouteConfig = {
  method: "put",
  path: "/products/{productId}/sales/restore",
  summary: "Restore old sales for a product",
  tags: ["Sales"],
  request: {
    body: bodyRequestFactory(z.array(CompleteSale)),
    params: ProductIDParam,
  },
  responses: {
    200: PostSaleRestoreResponse,
    404: errorResponseFactory(ErrorEntries.NO_PRODUCT, NoProductFoundError),
    400: errorResponseFactory(ErrorEntries.INVALID_PARAMETERS, BadRequestZod),
  },
};

export const deleteSaleByIdDocument: RouteConfig = {
  method: "delete",
  path: "/products/{productId}/sales/{saleId}",
  summary: "Delete a sale by its ID",
  tags: ["Sales"],
  request: {
    params: ProductIDParam.extend({
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
