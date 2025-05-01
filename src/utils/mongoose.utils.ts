import { Types } from "mongoose";
import { ServiceError } from "../errors/service.error";
import { StatusCodes } from "http-status-codes";

export const validateAndReturnObjectId = (id: string) => {
  if (!Types.ObjectId.isValid(id)) {
    throw new ServiceError(StatusCodes.BAD_REQUEST, "ID is invalid.");
  } else {
    return new Types.ObjectId(id);
  }
};
