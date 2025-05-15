import { z } from "zod";
import { SuccessEntries } from "../../constants/messages.constants";
import {
  GrowthRate,
  LRegression,
  MovingAverages,
} from "../../types/lifecycle.types";
import { documentSuccessFactory, MiniProductResponseItem } from "../utils";

export const MovingAveragesResponse = documentSuccessFactory(
  SuccessEntries.OK_MOVING_AVERAGES,
  {
    product: MiniProductResponseItem,
    averages: z.array(MovingAverages.ZodUnit),
  },
);

export const GrowthRatesResponse = documentSuccessFactory(
  SuccessEntries.OK_GROWTH_RATES,
  {
    product: MiniProductResponseItem,
    growthRates: z.array(GrowthRate.ZodUnit),
  },
);

export const AccelerationRatesResponse = documentSuccessFactory(
  SuccessEntries.OK_ACCELERATION_RATES,
  {
    product: MiniProductResponseItem,
    accelerationRates: z.array(GrowthRate.ZodAccelerationUnit),
  },
);

export const LinearRegressionSlopesResponse = documentSuccessFactory(
  SuccessEntries.OK_LINEAR_REGRESSION_SLOPES,
  {
    product: MiniProductResponseItem,
    slopes: z.array(LRegression.ZodUnit),
  },
);

export const PhasesResponse = documentSuccessFactory(SuccessEntries.OK_PHASES, {
  product: MiniProductResponseItem,
  maturity_top: z.number(),
  maturity_bottom: z.number(),
  slopes: z.array(LRegression.ZodPhaseUnit),
});
