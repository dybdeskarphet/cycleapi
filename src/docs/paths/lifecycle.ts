import {
  extendZodWithOpenApi,
  RouteConfig,
} from "@asteasolutions/zod-to-openapi";
import { z } from "zod";
import { NoProductFoundError, ObjectIdSchema } from "../components/products";
import {
  ErrorEntries,
  SuccessEntries,
} from "../../constants/messages.constants";
import { BadRequestZod } from "../utils";
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
  path: "/lifecycle/{id}/moving-averages",
  summary: "Get the moving averages of sales of a product by its ID",
  tags: ["Lifecycle"],
  request: {
    params: z.object({
      id: ObjectIdSchema.openapi({
        description: "Product ID",
        param: { name: "id", in: "path" },
      }),
    }),
    body: {
      content: {
        "application/json": {
          schema: MovingAverages.RequestBody,
        },
      },
      required: true,
    },
  },
  responses: {
    200: {
      description: SuccessEntries.OK_MOVING_AVERAGES.message,
      content: {
        "application/json": {
          schema: MovingAveragesResponse,
        },
      },
    },
    404: {
      description: ErrorEntries.NO_PRODUCT.message,
      content: {
        "application/json": {
          schema: z.union([NoProductFoundError, BadRequestZod]),
        },
      },
    },
  },
};

export const getGrowthRatesDocument: RouteConfig = {
  method: "post",
  path: "/lifecycle/{id}/growth-rates",
  summary: "Get the growth rates of sales of a product by its ID",
  tags: ["Lifecycle"],
  request: {
    params: z.object({
      id: ObjectIdSchema.openapi({
        description: "Product ID",
        param: { name: "id", in: "path" },
      }),
    }),
    body: {
      content: {
        "application/json": {
          schema: GrowthRate.RequestBody,
        },
      },
      required: true,
    },
  },
  responses: {
    200: {
      description: SuccessEntries.OK_GROWTH_RATES.message,
      content: {
        "application/json": {
          schema: GrowthRatesResponse,
        },
      },
    },
    404: {
      description: ErrorEntries.NO_PRODUCT.message,
      content: {
        "application/json": {
          schema: z.union([NoProductFoundError, BadRequestZod]),
        },
      },
    },
  },
};

export const getAccelerationRatesDocument: RouteConfig = {
  method: "post",
  path: "/lifecycle/{id}/acceleration-rates",
  summary: "Get the acceleration rates of sales of a product by its ID",
  tags: ["Lifecycle"],
  request: {
    params: z.object({
      id: ObjectIdSchema.openapi({
        description: "Product ID",
        param: { name: "id", in: "path" },
      }),
    }),
    body: {
      content: {
        "application/json": {
          schema: GrowthRate.RequestBody,
        },
      },
      required: true,
    },
  },
  responses: {
    200: {
      description: SuccessEntries.OK_ACCELERATION_RATES.message,
      content: {
        "application/json": {
          schema: AccelerationRatesResponse,
        },
      },
    },
    404: {
      description: ErrorEntries.NO_PRODUCT.message,
      content: {
        "application/json": {
          schema: z.union([NoProductFoundError, BadRequestZod]),
        },
      },
    },
  },
};

export const lrSlopesDocument: RouteConfig = {
  method: "post",
  path: "/lifecycle/{id}/lr-slopes",
  summary: "Get the linear regression slopes of sales of a product by its ID",
  tags: ["Lifecycle"],
  request: {
    params: z.object({
      id: ObjectIdSchema.openapi({
        description: "Product ID",
        param: { name: "id", in: "path" },
      }),
    }),
    body: {
      content: {
        "application/json": {
          schema: LRegression.RequestBody,
        },
      },
      required: true,
    },
  },
  responses: {
    200: {
      description: SuccessEntries.OK_ACCELERATION_RATES.message,
      content: {
        "application/json": {
          schema: LinearRegressionSlopesResponse,
        },
      },
    },
    404: {
      description: ErrorEntries.NO_PRODUCT.message,
      content: {
        "application/json": {
          schema: z.union([NoProductFoundError, BadRequestZod]),
        },
      },
    },
  },
};

export const phasesDocument: RouteConfig = {
  method: "post",
  path: "/lifecycle/{id}/phases-with-lr",
  summary: "Get the phases of a product by its ID",
  tags: ["Lifecycle"],
  request: {
    params: z.object({
      id: ObjectIdSchema.openapi({
        description: "Product ID",
        param: { name: "id", in: "path" },
      }),
    }),
    body: {
      content: {
        "application/json": {
          schema: LRegression.RequestBodyWithSensitivity,
        },
      },
      required: true,
    },
  },
  responses: {
    200: {
      description: SuccessEntries.OK_PHASES.message,
      content: {
        "application/json": {
          schema: PhasesResponse,
        },
      },
    },
    404: {
      description: ErrorEntries.NO_PRODUCT.message,
      content: {
        "application/json": {
          schema: z.union([NoProductFoundError, BadRequestZod]),
        },
      },
    },
  },
};
