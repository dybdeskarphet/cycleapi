import {
  OpenAPIRegistry,
  OpenApiGeneratorV3,
  RouteConfig,
} from "@asteasolutions/zod-to-openapi";
import {
  deleteProductByIdDocument,
  filterProductDocument,
  getProductByIdDocument,
  getProductsDocument,
  postProductDocument,
} from "./paths/products";
import {
  deleteSaleByIdDocument,
  getSalesByIntervalDocument,
  postRestoreSalesDocument,
  postSaleDocument,
} from "./paths/sales";
import {
  getGrowthRatesDocument,
  getMovingAveragesDocument,
  lrSlopesDocument,
  phasesDocument,
} from "./paths/lifecycle";

export const registry = new OpenAPIRegistry();

const documents: RouteConfig[] = [
  getProductsDocument,
  postProductDocument,
  filterProductDocument,
  getProductByIdDocument,
  deleteProductByIdDocument,
  getSalesByIntervalDocument,
  postSaleDocument,
  postRestoreSalesDocument,
  deleteSaleByIdDocument,
  getMovingAveragesDocument,
  getGrowthRatesDocument,
  lrSlopesDocument,
  phasesDocument,
];

documents.forEach((doc) => {
  registry.registerPath(doc);
});

const generator = new OpenApiGeneratorV3(registry.definitions);
export const openApiDocument = generator.generateDocument({
  openapi: "3.0.0",
  info: {
    title: "CycleAPI",
    description: "Product forecasting and recommendation API.",
    version: "1.0.0",
  },
});
