import { Request, Response } from "express";
import { ApiError } from "../errors/api.error";
import { StatusCodes } from "http-status-codes";
import { SafeParseReturnType } from "zod";
import "dotenv/config";
import { ErrorMessages } from "../enums/messages.enum";

export const handleControllerError = (
  res: Response,
  error: unknown,
  verbose?: boolean,
) => {
  if (error instanceof ApiError) {
    (verbose || process.env.VERBOSE_LOG === "true") && console.error(error);
    res.status(error.status).json({
      success: false,
      message: error.message,
      ...(error.errors ? { errors: error.errors } : []),
    });
  } else if (error instanceof Error && error.name === "ValidationError") {
    (verbose || process.env.VERBOSE_LOG === "true") && console.error(error);
    res
      .status(StatusCodes.BAD_REQUEST)
      .json({ success: false, message: `${error}` });
  } else if (error instanceof SyntaxError) {
    (verbose || process.env.VERBOSE_LOG === "true") && console.error(error);
    res
      .status(StatusCodes.BAD_REQUEST)
      .json({ success: false, message: `Invalid JSON format.` });
  } else {
    (verbose || process.env.VERBOSE_LOG === "true") && console.error(error);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ success: false, message: "Internal server error." });
  }
};

export const withController = (
  controllerFn: (req: Request, res: Response) => Promise<void>,
) => {
  return async (req: Request, res: Response) => {
    try {
      await controllerFn(req, res);
    } catch (error) {
      handleControllerError(res, error, true);
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
      ErrorMessages.ZOD_ERROR,
      parsed.error.issues,
    );
  }

  return parsed.data;
};

export const sendSuccess = <TData>(
  res: Response,
  data: TData,
  message = "Success.",
  status = StatusCodes.OK,
) => {
  return res.status(status).json({
    success: true,
    message,
    data,
  });
};
