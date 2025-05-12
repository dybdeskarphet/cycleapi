import { Types } from "mongoose";
import { ApiError } from "../errors/api.error";
import { StatusCodes } from "http-status-codes";
import { ErrorEntries } from "../constants/messages.constants";

export const validateAndReturnObjectId = (id: string) => {
  if (!Types.ObjectId.isValid(id)) {
    throw new ApiError(StatusCodes.BAD_REQUEST, ErrorEntries.INVALID_ID);
  } else {
    return new Types.ObjectId(id);
  }
};
