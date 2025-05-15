import { z } from "zod";
import {
  SuccessEntries,
  ErrorEntries,
} from "../../constants/messages.constants";
import {
  DeleteCountResponseItem,
  documentErrorFactory,
  documentSuccessFactory,
  MiniProductResponseItem,
} from "../utils";
import { Types } from "mongoose";
import { ZodIMiniSale, ZodISale } from "../../types/sale.types";

export const CompleteSale = z
  .object({
    _id: z.instanceof(Types.ObjectId),
  })
  .merge(ZodISale)
  .extend({
    createdAt: z.date(),
    updatedAt: z.date(),
    __v: z.number().default(0),
  });

export const GetSalesResponse = documentSuccessFactory(
  SuccessEntries.SALE_LISTED,
  {
    product: MiniProductResponseItem,
    sales: z.array(z.union([CompleteSale, ZodIMiniSale])),
  },
);

export const PostSaleResponse = documentSuccessFactory(
  SuccessEntries.SALE_CREATED,
  {
    product: MiniProductResponseItem,
    sale: CompleteSale,
  },
);

export const PostSaleRestoreResponse = documentSuccessFactory(
  SuccessEntries.SALE_RESTORED,
  {
    product: MiniProductResponseItem,
    sales: z.array(CompleteSale),
  },
);

export const DeleteSaleByIdResponse = documentSuccessFactory(
  SuccessEntries.SALE_DELETED,
  {
    product: MiniProductResponseItem,
    deleteCount: DeleteCountResponseItem,
    sale: CompleteSale,
  },
);

export const NoSaleFoundError = documentErrorFactory(ErrorEntries.NO_SALE);
