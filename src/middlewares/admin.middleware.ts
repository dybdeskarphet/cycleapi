import { NextFunction, Request, Response } from "express";
import "dotenv/config";
import { ApiError } from "../errors/api.error";
import { StatusCodes } from "http-status-codes";
import { ErrorEntries } from "../constants/messages.constants";

export const requireAdminAuth = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const adminToken = process.env.ADMIN_API_TOKEN;
  const token = req.header("x-admin-api-key");

  // TODO: ApiError is not handled by the error handler, use a error handler middleware.
  if (token !== adminToken) {
    throw new ApiError(StatusCodes.UNAUTHORIZED, ErrorEntries.UNAUTHORIZED);
  }

  next();
};

// TODO: Now it's time to write the requireScope middleware
