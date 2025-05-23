import { extendZodWithOpenApi } from "@asteasolutions/zod-to-openapi";
import { z } from "zod";

extendZodWithOpenApi(z);

export const ObjectIdSchema = z.string().regex(/^[a-f\d]{24}$/i);
