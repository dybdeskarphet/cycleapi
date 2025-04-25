import mongoose, { Document, Schema } from "mongoose";
import { ProductTypes } from "../types/product.types";
import Region from "../enums/region.enum";

const ProductSchema = new mongoose.Schema<ProductTypes.IProduct>(
  {
    name: { type: String, required: true },
    category: { type: String, required: true },
    launchDate: { type: Date, required: true },
    price: { type: Number, required: true },
    region: { type: String, enum: Region, default: Region.TURKIYE },
    sales: [{ type: mongoose.Schema.Types.ObjectId, ref: "Unit" }],
  },
  { timestamps: true },
);

const Product = mongoose.model("Product", ProductSchema);

export { Product };
