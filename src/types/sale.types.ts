import { Types, HydratedDocument } from "mongoose";
import { z } from "zod";
import { Product } from "../models/product.model";
import { ProductDocument } from "./product.types";

export const ZodISale = z.object({
  product: z.instanceof(Types.ObjectId).or(z.instanceof(Product)),
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

export const ZodSaleRequestBody = z.object({
  amount: z.number().min(1),
  customPrice: z.number().min(1).optional(),
  createdAt: z.string().optional(),
  updatedAt: z.string().optional(),
});

export type SaleRequestBody = z.infer<typeof ZodSaleRequestBody>;

export type SaleDocument = HydratedDocument<ISale>;

export const ZodIMiniSale = z.object({
  amount: z.number(),
  createdAt: z.string(),
});

export type IMiniSale = z.infer<typeof ZodIMiniSale>;

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
