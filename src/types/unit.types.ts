import mongoose, { HydratedDocument } from "mongoose";

export namespace UnitTypes {
  export interface IUnit {
    product: mongoose.Types.ObjectId;
    amount: number;
    customPrice: number;
  }

  export type UnitDocument = HydratedDocument<IUnit>;
}
