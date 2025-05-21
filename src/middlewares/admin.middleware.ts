import { NextFunction, Request, Response } from "express";
import "dotenv/config";
import { ApiError } from "../errors/api.error";
import { StatusCodes } from "http-status-codes";
import { ErrorEntries } from "../constants/messages.constants";
import { Scopes } from "../enums/scopes.enum";
import { z } from "zod";
import { handleZodParsed } from "../utils/express.utils";
import { getTokenByItselfService } from "../services/token.service";
import "dotenv/config";

export const requireAdminAuth = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const adminToken = process.env.ADMIN_API_TOKEN;
  const token = handleZodParsed(
    z.string().safeParse(req.header("x-admin-api-key")),
  );

  if (token !== adminToken) {
    throw new ApiError(StatusCodes.UNAUTHORIZED, ErrorEntries.UNAUTHORIZED);
  }

  next();
};

export const requireScope = (requiredScopes: Scopes[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const tokenString = handleZodParsed(
        z
          .string({ message: "You have to provide an API token." })
          .safeParse(req.header("x-api-key")),
      );

      if (process.env.NODE_ENV === "development") {
        return next();
      }

      const token = await getTokenByItselfService(tokenString);

      const lastUsed = token.lastUsedAt.getTime();
      const expirationDate = lastUsed + token.timeoutMs;
      const now = Date.now();

      if (now > expirationDate) {
        throw new ApiError(
          StatusCodes.UNAUTHORIZED,
          ErrorEntries.INVALID_TOKEN,
        );
      }

      if (!requiredScopes.every((scope) => token.scopes.includes(scope))) {
        throw new ApiError(
          StatusCodes.UNAUTHORIZED,
          ErrorEntries.INSUFFICIENT_PERMISSIONS,
        );
      }

      token.lastUsedAt = new Date(now);
      await token.save();
      (req as any).apiToken = token;
      next();
    } catch (error) {
      next(error);
    }
  };
};
