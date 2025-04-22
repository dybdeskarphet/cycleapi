import { NextFunction, Request, Response } from "express";

// TODO: This doesn't work and i don't know why, fix it whenever you can.
const handleInvalidJson = async (
  err: any,
  res: Response,
  next: NextFunction,
) => {
  if (err instanceof SyntaxError) {
    console.error("Invalid JSON:", err.message);
    res.status(400).json({ message: "Invalid JSON syntax" });
    return;
  }
  next(err);
};

export default handleInvalidJson;
