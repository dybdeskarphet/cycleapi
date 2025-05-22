import { z } from "zod";
import { Scopes } from "../enums/scopes.enum";
import { HydratedDocument } from "mongoose";
import { DateWithOpenapi } from "./global.types";

export namespace IToken {
  export const Zod = z.object({
    token: z.string(),
    scopes: z.array(z.nativeEnum(Scopes)),
    lastUsedAt: DateWithOpenapi,
    timeoutMs: z.number(),
  });

  export type TS = z.infer<typeof Zod>;

  export type Document = HydratedDocument<TS>;
}

export namespace TokenRequestBody {
  export const Zod = IToken.Zod.pick({
    scopes: true,
  }).extend({ timeout: z.string() });
  export type TS = z.infer<typeof Zod>;
}
