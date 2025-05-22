import {
  extendZodWithOpenApi,
  RouteConfig,
} from "@asteasolutions/zod-to-openapi";
import { z } from "zod";
import { NoProductFoundError, ProductIDParam } from "../components/products";
import { ErrorEntries } from "../../constants/messages.constants";
import {
  BadRequestZod,
  bodyRequestFactory,
  errorResponseFactory,
} from "../utils";
import {
  AccelerationRatesResponse,
  GrowthRatesResponse,
  LinearRegressionSlopesResponse,
  MovingAveragesResponse,
  PhasesResponse,
} from "../components/lifecycle";
import {
  GrowthRate,
  LRegression,
  MovingAverages,
} from "../../types/lifecycle.types";

extendZodWithOpenApi(z);

export const getMovingAveragesDocument: RouteConfig = {
  method: "post",
  path: "/lifecycle/{productId}/moving-averages",
  summary: "Get the moving averages of sales of a product by its ID",
  tags: ["Lifecycle"],
  request: {
    params: ProductIDParam,
    body: bodyRequestFactory(MovingAverages.RequestBody),
  },
  responses: {
    200: MovingAveragesResponse,
    404: errorResponseFactory(ErrorEntries.NO_PRODUCT, NoProductFoundError),
    400: errorResponseFactory(ErrorEntries.ZOD_ERROR, BadRequestZod),
  },
};

export const getGrowthRatesDocument: RouteConfig = {
  method: "post",
  path: "/lifecycle/{productId}/growth-rates",
  summary: "Get the growth rates of sales of a product by its ID",
  tags: ["Lifecycle"],
  request: {
    params: ProductIDParam,
    body: bodyRequestFactory(GrowthRate.RequestBody),
  },
  responses: {
    200: GrowthRatesResponse,
    404: errorResponseFactory(ErrorEntries.NO_PRODUCT, NoProductFoundError),
    400: errorResponseFactory(ErrorEntries.ZOD_ERROR, BadRequestZod),
  },
};

export const getAccelerationRatesDocument: RouteConfig = {
  method: "post",
  path: "/lifecycle/{productId}/acceleration-rates",
  summary: "Get the acceleration rates of sales of a product by its ID",
  tags: ["Lifecycle"],
  request: {
    params: ProductIDParam,
    body: bodyRequestFactory(GrowthRate.RequestBody),
  },
  responses: {
    200: AccelerationRatesResponse,
    404: errorResponseFactory(ErrorEntries.NO_PRODUCT, NoProductFoundError),
    400: errorResponseFactory(ErrorEntries.ZOD_ERROR, BadRequestZod),
  },
};

export const lrSlopesDocument: RouteConfig = {
  method: "post",
  path: "/lifecycle/{productId}/lr-slopes",
  summary: "Get the linear regression slopes of sales of a product by its ID",
  tags: ["Lifecycle"],
  request: {
    params: ProductIDParam,
    body: bodyRequestFactory(LRegression.RequestBody),
  },
  responses: {
    200: LinearRegressionSlopesResponse,
    404: errorResponseFactory(ErrorEntries.NO_PRODUCT, NoProductFoundError),
    400: errorResponseFactory(ErrorEntries.ZOD_ERROR, BadRequestZod),
  },
};

export const phasesDocument: RouteConfig = {
  method: "post",
  path: "/lifecycle/{productId}/phases-with-lr",
  summary: "Get the phases of a product by its ID",
  tags: ["Lifecycle"],
  request: {
    params: ProductIDParam,
    body: bodyRequestFactory(LRegression.RequestBodyWithSensitivity),
  },
  responses: {
    200: PhasesResponse,
    404: errorResponseFactory(ErrorEntries.NO_PRODUCT, NoProductFoundError),
    400: errorResponseFactory(ErrorEntries.ZOD_ERROR, BadRequestZod),
  },
};
