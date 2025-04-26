import { Types } from "mongoose";
import { ServiceError } from "../errors/service.error";

export const validateAndReturnObjectId = (id: string) => {
  if (!Types.ObjectId.isValid(id)) {
    throw new ServiceError(500, "ID is invalid.");
  } else {
    return new Types.ObjectId(id);
  }
};
