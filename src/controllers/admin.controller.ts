import { Request, Response } from "express";
import {
  handleZodParsed,
  sendSuccess,
  withController,
} from "../utils/express.utils";
import { generateTokenService } from "../services/admin.service";
import { TokenRequestBody } from "../types/token.types";
import { SuccessEntries } from "../constants/messages.constants";

export const generateTokenController = withController(
  async (req: Request, res: Response) => {
    const body = handleZodParsed(TokenRequestBody.Zod.safeParse(req.body));
    const token = await generateTokenService(body);
    sendSuccess(
      res,
      {
        tokenObject: token,
      },
      SuccessEntries.TOKEN_CREATED,
    );
  },
);
