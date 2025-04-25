import mongoose from "mongoose";

export namespace UnitTypes {
  export interface IUnit extends Document {
    product: mongoose.Types.ObjectId;
    amount: number;
    customPrice: number;
  }
}
