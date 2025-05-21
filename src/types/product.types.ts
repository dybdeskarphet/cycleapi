import { HydratedDocument, Types } from "mongoose";
import Region from "../enums/region.enum";
import { SaleDocument } from "./sale.types";
import { z } from "zod";
import { Sale } from "../models/sale.model";

// NOTE: There is no way to convert this zod object to IProduct,
// nor the ZodISale to ISale, I tried everything.
export const ZodIProduct = z.object({
  name: z.string(),
  category: z.string(),
  launchDate: z.date(),
  price: z.number(),
  region: z.nativeEnum(Region),
  sales: z.array(z.union([z.instanceof(Types.ObjectId), z.string()])),
});

export interface IProduct {
  name: string;
  category: string;
  launchDate: Date;
  price: number;
  region: Region;
  sales: (Types.ObjectId | SaleDocument)[];
}

export type ProductDocument = HydratedDocument<IProduct>;

export namespace ProductRequestBody {
  export const Zod = z.object({
    name: z.string(),
    category: z.string(),
    launchDate: z.string(),
    price: z.number(),
    region: z.nativeEnum(Region).optional(),
    sales: z
      .array(z.union([z.instanceof(Types.ObjectId), z.instanceof(Sale)]))
      .optional(),
  });

  export type TS = z.infer<typeof Zod>;
}

export namespace ProductFilterBody {
  export const Zod = z
    .object({
      _id: z.instanceof(Types.ObjectId),
      name: z.string(),
      category: z.string(),
      price: z.number(),
      launchDate: z.date(),
      region: z.nativeEnum(Region),
      createdAt: z.date(),
      updatedAt: z.date(),
    })
    .partial();
  export type TS = z.infer<typeof Zod>;
}

export const ZodProductPopulatableFields = z.array(z.enum(["sales"]));
export type ProductPopulatableFields = z.infer<
  typeof ZodProductPopulatableFields
>;
