import { Types, HydratedDocument } from "mongoose";
import { z } from "zod";
import { ProductDocument } from "./product.types";
import { extendZodWithOpenApi } from "@asteasolutions/zod-to-openapi";
import { DateWithOpenapi, ObjectIdWithOpenapi } from "./global.types";
import { timeToDate } from "../utils/time.utils";

extendZodWithOpenApi(z);

export const ZodISale = z.object({
  product: ObjectIdWithOpenapi,
  amount: z.number().min(1),
  customPrice: z.number(),
  createdAt: DateWithOpenapi,
  updatedAt: DateWithOpenapi,
});

export interface ISale {
  product: Types.ObjectId | ProductDocument;
  amount: number;
  customPrice: number;
  createdAt: Date;
  updatedAt: Date;
}

export type SaleDocument = HydratedDocument<ISale>;

export namespace SaleRequestBody {
  export const Zod = z.object({
    amount: z.number().min(1),
    customPrice: z.number().min(1).optional(),
    createdAt: z.string().optional(),
    updatedAt: z.string().optional(),
  });

  export type TS = z.infer<typeof Zod>;
}

export namespace IMiniSale {
  export const Zod = z.object({
    amount: z.number(),
    createdAt: z.string().openapi({
      example: timeToDate(new Date(), "week"),
    }),
  });

  export type TS = z.infer<typeof Zod>;
}

export namespace RestoreSaleInputSchema {
  export const Zod = z
    .object({
      _id: ObjectIdWithOpenapi.optional(),
      amount: z.number(),
      customPrice: z.number().optional(),
      createdAt: z.string().datetime(),
      updatedAt: z.string().datetime(),
    })
    .passthrough();

  export type TS = z.infer<typeof Zod>;
}

export namespace RestoreSaleInputArraySchema {
  export const Zod = z.array(RestoreSaleInputSchema.Zod);
  export type TS = z.infer<typeof Zod>;
}
