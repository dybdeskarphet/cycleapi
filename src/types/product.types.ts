import { Types } from "mongoose";
import Region from "../enums/region.enum";

export namespace ProductTypes {
  export interface IProduct extends Document {
    name: string;
    category: string;
    creationDate: Date;
    launchDate: Date;
    price: number;
    region: Region;
    sales: Types.ObjectId[];
  }

  export type ProductInput = Pick<
    ProductTypes.IProduct,
    "name" | "category" | "launchDate" | "price" | "sales"
  >;
}
