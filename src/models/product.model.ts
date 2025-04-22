import mongoose, { Document, Schema } from "mongoose";
import { ProductTypes } from "../types/product.types";
import Region from "../enums/region.enum";

const ProductSchema = new mongoose.Schema<ProductTypes.IProduct>({
  name: { type: String, required: true },
  category: { type: String, required: true },
  creationDate: { type: Date, default: Date.now },
  launchDate: { type: Date, required: true },
  price: { type: Number, required: true },
  region: { type: String, enum: Region, default: Region.TURKIYE },
  sales: {
    type: [
      {
        timestamp: { type: Date, required: true },
        unitsSold: { type: Number, required: true },
      },
    ],
    default: [],
  },
});

const Product = mongoose.model("Product", ProductSchema);

export { Product };
