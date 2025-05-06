import { z } from "zod";

export enum Intervals {
  Monthly = "monthly",
  Yearly = "yearly",
  Daily = "daily",
  Weekly = "weekly",
}

export enum IntervalsWithInstant {
  Monthly = "monthly",
  Yearly = "yearly",
  Daily = "daily",
  Weekly = "weekly",
  Instant = "instant",
}

export const IntervalsSchema = z.nativeEnum(Intervals);
export const IntervalsWithInstantSchema = z.nativeEnum(IntervalsWithInstant);
