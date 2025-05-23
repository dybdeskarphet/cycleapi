import { randomBytes } from "node:crypto";
import { TokenRequestBody } from "../types/token.types";
import { Token } from "../models/token.model";
import ms, { StringValue } from "ms";
import { ApiError } from "../errors/api.error";
import { StatusCodes } from "http-status-codes";
import { ErrorEntries } from "../constants/messages.constants";

export const generateTokenService = async (tokenBody: TokenRequestBody.TS) => {
  const token = randomBytes(32).toString("hex");
  // NOTE: vercel/ms doesn't have a validation system, but it
  // returns undefined if the string is not StringValue
  // so this is the only way to validate it.
  const timeoutMs = ms(tokenBody.timeout as StringValue);
  if (!timeoutMs || timeoutMs <= 0) {
    throw new ApiError(StatusCodes.BAD_REQUEST, ErrorEntries.INVALID_TIMEOUT);
  }

  const newToken = new Token({
    token,
    scopes: tokenBody.scopes,
    timeoutMs: timeoutMs,
  });

  await newToken.save();
  return newToken;
};
