import mongoose, { Schema } from "mongoose";
import { UnitTypes } from "../types/unit.types";

const UnitSchema = new mongoose.Schema<UnitTypes.IUnit>(
  {
    product: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "Product",
    },
    amount: { type: Number, default: 1 },
    customPrice: { type: Number },
  },
  { timestamps: true },
);

const Unit = mongoose.model("Unit", UnitSchema);

export { Unit };
