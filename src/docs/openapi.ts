import {
  OpenAPIRegistry,
  OpenApiGeneratorV3,
  RouteConfig,
} from "@asteasolutions/zod-to-openapi";
import { OpenAPIObjectConfig } from "@asteasolutions/zod-to-openapi/dist/v3.0/openapi-generator";
import "dotenv/config";
import ip from "ip";
import { postGenerateTokenDocument } from "./paths/admin";
import {
  getGrowthRatesDocument,
  getMovingAveragesDocument,
  lrSlopesDocument,
  phasesDocument,
} from "./paths/lifecycle";
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
  postGenerateTokenDocument,
];

documents.forEach((doc) => {
  registry.registerPath(doc);
});

const port = process.env.API_PORT || 3000;
const localServerUrl = `http://${ip.address()}:${port}/api/v1`;
const generator = new OpenApiGeneratorV3(registry.definitions);

export const apiKeyAuth = registry.registerComponent("headers", "api-key", {
  example: "-",
  required: true,
  description: "The API key provided to you by the admin.",
});

export const openApiDocument: OpenAPIObjectConfig = generator.generateDocument({
  info: {
    title: "CycleAPI",
    description: "Product forecasting and recommendation API.",
    version: "1.0.0",
    license: {
      name: "GPLv3",
      url: "https://www.gnu.org/licenses/gpl-3.0.en.html",
    },
    contact: {
      name: "Ahmet Arda Kavakcı",
      url: "https://kavakci.dev",
      email: "ahmetardakavakci@gmail.com",
    },
  },
  security: [{ [apiKeyAuth.name]: [] }],
  openapi: "3.0.0",
  servers: [{ url: localServerUrl, description: "Local server URL (v1)." }],
  tags: [
    {
      name: "Products",
      description: "Product CRUD operations",
    },
    {
      name: "Sales",
      description: "Sales CRUD operations",
    },
    {
      name: "Lifecycle",
      description: "Product lifecycle analysis operations",
    },
    {
      name: "Admin",
      description: "Admin actions",
    },
  ],
});
