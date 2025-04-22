import Region from "../enums/region.enum";

export namespace ProductTypes {
  export interface ISale {
    timestamp: Date;
    unitsSold: number;
  }

  export interface IProduct extends Document {
    name: string;
    category: string;
    creationDate: Date;
    launchDate: Date;
    price: number;
    region: Region;
    sales: ISale[];
  }
  export type ProductInput = Pick<
    ProductTypes.IProduct,
    "name" | "category" | "launchDate" | "price" | "sales"
  >;
}
