import { Types, HydratedDocument } from "mongoose";
import { ProductDocument } from "./product.types";

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

export type SaleDocument = HydratedDocument<ISale>;
