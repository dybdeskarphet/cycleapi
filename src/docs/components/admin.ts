import { z } from "zod";
import {
  ErrorEntries,
  SuccessEntries,
} from "../../constants/messages.constants";
import { errorJsonFactory, successResponseFactory } from "../utils";
import { Types } from "mongoose";
import { IToken } from "../../types/token.types";

export const CompleteToken = z
  .object({
    _id: z.instanceof(Types.ObjectId),
  })
  .merge(IToken.Zod)
  .extend({
    createdAt: z.date(),
    updatedAt: z.date(),
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
