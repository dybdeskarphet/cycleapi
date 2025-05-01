import mongoose, { Schema } from "mongoose";
import { ISale } from "../types/sale.types";

const SaleSchema = new mongoose.Schema<ISale>(
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

const Sale = mongoose.model("Sale", SaleSchema);

export { Sale };
