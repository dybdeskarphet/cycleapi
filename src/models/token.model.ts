import mongoose from "mongoose";
import { Scopes } from "../enums/scopes.enum";
import { IToken } from "../types/token.types";

const TokenSchema = new mongoose.Schema<IToken.TS>(
  {
    token: { type: String, required: true },
    scopes: { type: [String], enum: Object.values(Scopes), required: true },
    lastUsedAt: { type: Date, default: Date.now },
    timeoutMs: { type: Number, required: true },
  },
  { timestamps: true },
);

const Token = mongoose.model("Token", TokenSchema);

export { Token };
