import { z } from "zod";
import {
  ErrorEntries,
  SuccessEntries,
} from "../../constants/messages.constants";
import { errorJsonFactory, successResponseFactory } from "../utils";
import { IToken } from "../../types/token.types";
import { ObjectIdWithOpenapi, DateWithOpenapi } from "../../types/global.types";

export const CompleteToken = z
  .object({
    _id: ObjectIdWithOpenapi,
  })
  .merge(IToken.Zod)
  .extend({
    createdAt: DateWithOpenapi,
    updatedAt: DateWithOpenapi,
    __v: z.number().default(0),
  });

export const GenerateTokenResponse = successResponseFactory(
  SuccessEntries.TOKEN_CREATED,
  {
    token: CompleteToken,
  },
);

export const InvalidTimeoutError = errorJsonFactory(
  ErrorEntries.INVALID_TIMEOUT,
);

export const UnauthorizedError = errorJsonFactory(ErrorEntries.UNAUTHORIZED);
