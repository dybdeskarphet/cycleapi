import { Request, Response } from "express";
import { handleControllerError } from "./error-response";

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
