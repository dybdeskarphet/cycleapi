import { Types, HydratedDocument } from "mongoose";
import { ProductTypes } from "./product.types";

export namespace UnitTypes {
  export interface IUnit {
    product: Types.ObjectId | ProductTypes.ProductDocument;
    amount: number;
    customPrice: number;
    createdAt: Date;
    updatedAt: Date;
  }

  export interface IMiniUnit {
    amount: number;
    createdAt: string;
  }

  export type UnitDocument = HydratedDocument<IUnit>;
}
