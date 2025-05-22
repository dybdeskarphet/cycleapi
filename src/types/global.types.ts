import { extendZodWithOpenApi } from "@asteasolutions/zod-to-openapi";
import { Types } from "mongoose";
import { z } from "zod";

extendZodWithOpenApi(z);

export const ObjectIdWithOpenapi = z
  .instanceof(Types.ObjectId)
  .openapi({ example: new Types.ObjectId() });

export const DateWithOpenapi = z
  .date()
  .openapi({ example: new Date().toISOString() });
