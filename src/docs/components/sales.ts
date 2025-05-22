import { z } from "zod";
import {
  SuccessEntries,
  ErrorEntries,
} from "../../constants/messages.constants";
import {
  DeleteCountResponseItem,
  errorJsonFactory,
  successResponseFactory,
  MiniProductResponseItem,
} from "../utils";
import { Types } from "mongoose";
import { IMiniSale, ZodISale } from "../../types/sale.types";
import { DateWithOpenapi, ObjectIdWithOpenapi } from "../../types/global.types";

export const CompleteSale = z
  .object({
    _id: ObjectIdWithOpenapi,
  })
  .merge(ZodISale)
  .extend({
    createdAt: DateWithOpenapi,
    updatedAt: DateWithOpenapi,
    __v: z.number().default(0),
  });

export const GetSalesResponse = successResponseFactory(
  SuccessEntries.SALE_LISTED,
  {
    product: MiniProductResponseItem,
    sales: z.array(z.union([CompleteSale, IMiniSale.Zod])),
  },
);

export const PostSaleResponse = successResponseFactory(
  SuccessEntries.SALE_CREATED,
  {
    product: MiniProductResponseItem,
    sale: CompleteSale,
  },
);

export const PostSaleRestoreResponse = successResponseFactory(
  SuccessEntries.SALE_RESTORED,
  {
    product: MiniProductResponseItem,
    sales: z.array(CompleteSale),
  },
);

export const DeleteSaleByIdResponse = successResponseFactory(
  SuccessEntries.SALE_DELETED,
  {
    product: MiniProductResponseItem,
    deleteCount: DeleteCountResponseItem,
    sale: CompleteSale,
  },
);

export const NoSaleFoundError = errorJsonFactory(ErrorEntries.NO_SALE);
