import { Request, Response } from "express";
import { createProductService } from "../services/product.service";
import { handleControllerError } from "../utils/error-response";

const postProductController = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const product = await createProductService(req.body);
    res.status(201).json({ message: "Product created.", data: { product } });
  } catch (error) {
    handleControllerError(res, error, true);
    return;
  }
};

export { postProductController };
