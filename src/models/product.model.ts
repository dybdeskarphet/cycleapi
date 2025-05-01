import mongoose, { Document, Schema } from "mongoose";
import Region from "../enums/region.enum";
import { IProduct } from "../types/product.types";

const ProductSchema = new mongoose.Schema<IProduct>(
  {
    name: { type: String, required: true },
    category: { type: String, required: true },
    launchDate: { type: Date, required: true },
    price: { type: Number, required: true },
    region: { type: String, enum: Region, default: Region.TURKIYE },
    sales: [{ type: mongoose.Schema.Types.ObjectId, ref: "Sale" }],
  },
  { timestamps: true },
);

const Product = mongoose.model("Product", ProductSchema);

export { Product };
