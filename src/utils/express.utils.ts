import { Request, Response } from "express";
import { ApiError } from "../errors/api.error";
import { StatusCodes } from "http-status-codes";
import { SafeParseReturnType } from "zod";
import "dotenv/config";
import { ErrorEntries } from "../constants/messages.constants";
import { SuccessEntry } from "../types/express.types";

export const handleControllerError = (
  res: Response,
  error: unknown,
  verbose?: boolean,
) => {
  if (error instanceof ApiError) {
    (verbose || process.env.VERBOSE_LOG === "true") && console.error(error);
    res.status(error.status).json({
      success: false,
      code: error.code,
      message: error.message,
      ...(error.errors ? { errors: error.errors } : []),
    });
  } else if (error instanceof Error && error.name === "ValidationError") {
    (verbose || process.env.VERBOSE_LOG === "true") && console.error(error);
    res
      .status(StatusCodes.BAD_REQUEST)
      .json({ success: false, code: "VALIDATION_ERROR", message: `${error}` });
  } else if (error instanceof SyntaxError) {
    (verbose || process.env.VERBOSE_LOG === "true") && console.error(error);
    res.status(StatusCodes.BAD_REQUEST).json({
      success: false,
      code: "INVALID_JSON",
      message: `Invalid JSON format.`,
    });
  } else {
    (verbose || process.env.VERBOSE_LOG === "true") && console.error(error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      code: ErrorEntries.INTERNAL_SERVER_ERROR.code,
      message: ErrorEntries.INTERNAL_SERVER_ERROR.message,
    });
  }
};

export const withController = (
  controllerFn: (req: Request, res: Response) => Promise<void>,
) => {
  return async (req: Request, res: Response) => {
    try {
      await controllerFn(req, res);
    } catch (error) {
      handleControllerError(res, error);
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
