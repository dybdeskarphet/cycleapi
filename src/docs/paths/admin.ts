import {
  extendZodWithOpenApi,
  RouteConfig,
} from "@asteasolutions/zod-to-openapi";
import { z } from "zod";
import { TokenRequestBody } from "../../types/token.types";
import {
  ErrorEntries,
  SuccessEntries,
} from "../../constants/messages.constants";
import {
  GenerateTokenResponse,
  InvalıdTimeoutError,
  UnauthorizedError,
} from "../components/admin";

extendZodWithOpenApi(z);

export const postGenerateTokenDocument: RouteConfig = {
  method: "post",
  path: "/admin/generate-token",
  summary: "Generate API key/token",
  tags: ["Admin"],
  request: {
    headers: z.object({
      "x-admin-api-key": z.string().openapi({
        description: "Admin token",
        param: { name: "x-admin-api-key", in: "header" },
      }),
    }),
    body: {
      content: {
        "application/json": {
          schema: TokenRequestBody.Zod,
        },
      },
      required: true,
    },
  },
  responses: {
    200: {
      description: SuccessEntries.TOKEN_CREATED.message,
      content: {
        "application/json": {
          schema: GenerateTokenResponse,
        },
      },
    },
    400: {
      description: ErrorEntries.INVALID_TIMEOUT.message,
      content: {
        "application/json": {
          schema: InvalıdTimeoutError,
        },
      },
    },
    401: {
      description: ErrorEntries.UNAUTHORIZED.message,
      content: {
        "application/json": {
          schema: UnauthorizedError,
        },
      },
    },
  },
};
