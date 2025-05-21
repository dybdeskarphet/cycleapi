import { Types, HydratedDocument } from "mongoose";
import { z } from "zod";
import { ProductDocument } from "./product.types";

export const ZodISale = z.object({
  product: z.union([z.instanceof(Types.ObjectId), z.string()]),
  amount: z.number().min(1),
  customPrice: z.number(),
  createdAt: z.date(),
  updatedAt: z.date(),
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
    createdAt: z.string(),
  });

  export type TS = z.infer<typeof Zod>;
}

export namespace RestoreSaleInputSchema {
  export const Zod = z
    .object({
      _id: z.instanceof(Types.ObjectId).optional(),
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
