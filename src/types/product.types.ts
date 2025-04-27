import { HydratedDocument, Types } from "mongoose";
import Region from "../enums/region.enum";
import { UnitTypes } from "./unit.types";

export namespace ProductTypes {
  export interface IProduct {
    name: string;
    category: string;
    creationDate: Date;
    launchDate: Date;
    price: number;
    region: Region;
    sales: (Types.ObjectId | UnitTypes.UnitDocument)[];
  }

  export type ProductDocument = HydratedDocument<ProductTypes.IProduct>;

  export type ProductInput = Pick<
    ProductTypes.IProduct,
    "name" | "category" | "launchDate" | "price" | "sales"
  >;
}
