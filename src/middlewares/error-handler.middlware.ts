import { NextFunction, Request, Response } from "express";
import { ApiError } from "../errors/api.error";
import { StatusCodes } from "http-status-codes";
import { ErrorEntries } from "../constants/messages.constants";

export const errorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  if (err instanceof ApiError) {
    res.status(err.status).json({
      success: false,
      code: err.code,
      message: err.message,
      ...(err.errors ? { errors: err.errors } : []),
    });
  } else if (err instanceof Error && err.name === "ValidationError") {
    res
      .status(StatusCodes.BAD_REQUEST)
      .json({ success: false, code: "VALIDATION_ERROR", message: `${err}` });
  } else {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      code: ErrorEntries.INTERNAL_SERVER_ERROR.code,
      message: ErrorEntries.INTERNAL_SERVER_ERROR.message,
    });
  }

  process.env.VERBOSE_LOG === "true" && console.error(err);
};
