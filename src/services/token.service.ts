import { StatusCodes } from "http-status-codes";
import { ApiError } from "../errors/api.error";
import { Token } from "../models/token.model";
import { IToken } from "../types/token.types";
import { validateAndReturnObjectId } from "../utils/mongoose.utils";
import { ErrorEntries } from "../constants/messages.constants";

export const getTokenByItselfService = async (
  tokenItself: string,
): Promise<IToken.Document> => {
  const token = await Token.findOne({ token: tokenItself }).exec();

  if (!token || !(token instanceof Token)) {
    throw new ApiError(StatusCodes.UNAUTHORIZED, ErrorEntries.INVALID_TOKEN);
  }

  return token;
};
