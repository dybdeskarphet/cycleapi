import { HydratedDocument, Types } from "mongoose";
import Region from "../enums/region.enum";
import { SaleDocument } from "./sale.types";

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

export type ProductInput = Pick<
  IProduct,
  "name" | "category" | "launchDate" | "price" | "sales"
>;
