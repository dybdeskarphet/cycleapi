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

  export interface Unit {
    amount: number;
    timestamp: string;
  }
}

export namespace GrowthRate {
  export interface Unit {
    rate: number;
    timestamp: string;
  }
  export interface AccelerationUnit {
    acceleration: number;
    timestamp: string;
  }
  export const RequestBody = z.object({
    interval: z.nativeEnum(Intervals),
  });
}

export namespace LRegression {
  export interface Unit {
    slope: number;
    timestamp: string;
  }
  export interface PhaseUnit {
    slope: number;
    phase: string;
    timestamp: string;
  }
  export const RequestBody = z.object({
    windowSize: z.number().min(1),
    interval: z.nativeEnum(Intervals),
  });
  export const RequestBodyWithSensitivity = RequestBody.extend({
    sensitivity: z.number().gt(0).max(1),
  });
}
