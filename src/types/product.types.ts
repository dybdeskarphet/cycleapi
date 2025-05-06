import { HydratedDocument, Types } from "mongoose";
import Region from "../enums/region.enum";
import { SaleDocument } from "./sale.types";
import { z } from "zod";
import { Sale } from "../models/sale.model";

export const ZodIProduct = z.object({
  name: z.string(),
  category: z.string(),
  creationDate: z.date(),
  launchDate: z.date(),
  price: z.number(),
  region: z.nativeEnum(Region),
  sales: z.array(z.instanceof(Types.ObjectId).or(z.instanceof(Sale))),
});

export interface IProduct {
  name: string;
  category: string;
  creationDate: Date;
  launchDate: Date;
  price: number;
  region: Region;
  sales: (Types.ObjectId | SaleDocument)[];
}

export type ProductDocument = HydratedDocument<IProduct>;

export const ZodProductRequestBody = z.object({
  name: z.string(),
  category: z.string(),
  launchDate: z.string(),
  price: z.number(),
  region: z.string().optional(),
  sales: z
    .array(z.instanceof(Types.ObjectId).or(z.instanceof(Sale)))
    .optional(),
});

export type ProductRequestBody = z.infer<typeof ZodProductRequestBody>;

export const ZodProductPopulatableFields = z.array(z.enum(["sales"]));
export type ProductPopulatableFields = z.infer<
  typeof ZodProductPopulatableFields
>;
