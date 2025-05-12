import { Types } from "mongoose";
import { ApiError } from "../errors/api.error";
import { StatusCodes } from "http-status-codes";
import { ErrorMessages } from "../enums/messages.enum";

export const validateAndReturnObjectId = (id: string) => {
  if (!Types.ObjectId.isValid(id)) {
    throw new ApiError(StatusCodes.BAD_REQUEST, ErrorMessages.INVALID_ID);
  } else {
    return new Types.ObjectId(id);
  }
};
