import { Response } from "express";
import { ServiceError } from "../errors/service.error";

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
    res.status(400).json({ message: `${error}` });
  } else if (error instanceof SyntaxError) {
    res.status(400).json({ message: `Invalid JSON format.` });
  } else {
    (verbose || process.env.VERBOSE_LOG === "true") && console.error(error);
    res.status(500).json({ message: "Internal server error." });
  }
};

export { handleControllerError };

