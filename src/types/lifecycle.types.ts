import { Intervals } from "../enums/intervals.enum";
import { withController } from "../utils/express.utils";
import { ZodIMiniSale } from "./sale.types";
import { z } from "zod";

export namespace MovingAverages {
  export const RequestBody = z.object({
    windowSize: z
      .number({
        required_error: "Window size should be specified.",
        invalid_type_error: "Window size must be a number.",
      })
      .min(1)
      .finite(),
    weight: z.boolean({
      required_error:
        "Moving averages method should be specified with 'weight'.",
      invalid_type_error: "'weight' must be boolean.",
    }),
    interval: z.nativeEnum(Intervals),
  });

  export const ZodUnit = z.object({
    amount: z.number(),
    timestamp: z.string(),
  });

  export type Unit = z.infer<typeof ZodUnit>;
}

export namespace GrowthRate {
  export const ZodUnit = z.object({
    rate: z.number(),
    timestamp: z.string(),
  });
  export type Unit = z.infer<typeof ZodUnit>;

  export const ZodAccelerationUnit = z.object({
    acceleration: z.number(),
    timestamp: z.string(),
  });
  export type AccelerationUnit = z.infer<typeof ZodAccelerationUnit>;

  export const RequestBody = z.object({
    interval: z.nativeEnum(Intervals),
  });
}

export namespace LRegression {
  export const ZodUnit = z.object({
    slope: z.number(),
    timestamp: z.string(),
  });
  export type Unit = z.infer<typeof ZodUnit>;

  export const ZodPhaseUnit = z.object({
    slope: z.number(),
    phase: z.string(),
    timestamp: z.string(),
  });
  export type PhaseUnit = z.infer<typeof ZodPhaseUnit>;

  export const RequestBody = z.object({
    windowSize: z.number().min(1),
    interval: z.nativeEnum(Intervals),
  });
  export const RequestBodyWithSensitivity = RequestBody.extend({
    sensitivity: z.number().gt(0).max(1),
  });
}
