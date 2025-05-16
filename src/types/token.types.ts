import { z } from "zod";
import { Scopes } from "../enums/scopes.enum";
import { HydratedDocument } from "mongoose";

export namespace IToken {
  export const Zod = z.object({
    token: z.string(),
    scopes: z.array(z.nativeEnum(Scopes)),
    lastUsedAt: z.date(),
    timeoutMs: z.number(),
  });

  export type TS = z.infer<typeof Zod>;

  export type Document = HydratedDocument<TS>;
}

export namespace TokenRequestBody {
  export const Zod = IToken.Zod.pick({
    scopes: true,
  }).extend({ timeoutMs: z.string() });
  export type TS = z.infer<typeof Zod>;
}
