import { Request, Response } from "express";
import { ServiceError } from "../errors/service.error";
import { StatusCodes } from "http-status-codes";

const handleControllerError = (
  res: Response,
  error: unknown,
  verbose: boolean = false,
) => {
  if (error instanceof ServiceError) {
    res.status(error.status).json({
      message: error.message,
      ...(error.errors ? { errors: error.errors } : []),
    });
  } else if (error instanceof Error && error.name === "ValidationError") {
    res.status(StatusCodes.BAD_REQUEST).json({ message: `${error}` });
  } else if (error instanceof SyntaxError) {
    res
      .status(StatusCodes.BAD_REQUEST)
      .json({ message: `Invalid JSON format.` });
  } else {
    (verbose || process.env.VERBOSE_LOG === "true") && console.error(error);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: "Internal server error." });
  }
};

export { handleControllerError };

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
