import {
  extendZodWithOpenApi,
  RouteConfig,
} from "@asteasolutions/zod-to-openapi";
import { z } from "zod";
import { TokenRequestBody } from "../../types/token.types";
import { ErrorEntries } from "../../constants/messages.constants";
import {
  GenerateTokenResponse,
  InvalidTimeoutError,
  UnauthorizedError,
} from "../components/admin";
import { errorResponseFactory } from "../utils";

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
    200: GenerateTokenResponse,
    400: errorResponseFactory(
      ErrorEntries.INVALID_TIMEOUT,
      InvalidTimeoutError,
    ),
    401: errorResponseFactory(ErrorEntries.UNAUTHORIZED, UnauthorizedError),
  },
};
