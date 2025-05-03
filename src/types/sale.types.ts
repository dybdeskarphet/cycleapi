import { Types, HydratedDocument } from "mongoose";
import { ProductDocument } from "./product.types";
import { z } from "zod";

export interface ISale {
  product: Types.ObjectId | ProductDocument;
  amount: number;
  customPrice: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface IMiniSale {
  amount: number;
  createdAt: string;
}

export const RestoreSaleInputSchema = z
  .object({
    _id: z.instanceof(Types.ObjectId).optional(),
    amount: z.number(),
    customPrice: z.number().optional(),
    createdAt: z.string().datetime(),
    updatedAt: z.string().datetime(),
  })
  .passthrough();

export const RestoreSaleInputArraySchema = z.array(RestoreSaleInputSchema);

export type RestoreSaleInputSchemaType = z.infer<typeof RestoreSaleInputSchema>;

export type RestoreSaleInputArraySchemaType = z.infer<
  typeof RestoreSaleInputArraySchema
>;

export type SaleDocument = HydratedDocument<ISale>;
