import { NextFunction, Request, Response } from "express";
import { ApiError } from "../errors/api.error";
import { StatusCodes } from "http-status-codes";
import { SafeParseReturnType } from "zod";
import "dotenv/config";
import { ErrorEntries } from "../constants/messages.constants";
import { SuccessEntry } from "../types/express.types";

export const withController = (
  controllerFn: (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => Promise<void>,
) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      await controllerFn(req, res, next);
    } catch (error) {
      next(error);
      return;
    }
  };
};

export const handleZodParsed = <Input, Output = Input>(
  parsed: SafeParseReturnType<Input, Output>,
): Output => {
  if (!parsed.success) {
    throw new ApiError(
      StatusCodes.BAD_REQUEST,
      ErrorEntries.ZOD_ERROR,
      parsed.error.issues,
    );
  }

  return parsed.data;
};

export const sendSuccess = <TData>(
  res: Response,
  data: TData,
  entry: SuccessEntry,
  status = StatusCodes.OK,
) => {
  return res.status(status).json({
    success: true,
    code: entry.code,
    message: entry.message,
    data,
  });
};

export const jsonVerify = (
  req: Request,
  res: Response,
  buf: Buffer,
  encoding: BufferEncoding,
) => {
  try {
    JSON.parse(buf.toString(encoding));
    return;
  } catch (e) {
    res.status(StatusCodes.BAD_REQUEST).json({
      success: false,
      code: "INVALID_JSON",
      message: `Invalid JSON format.`,
    });
    return;
  }
};
