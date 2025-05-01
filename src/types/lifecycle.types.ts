import { withController } from "../utils/express.utils";

export namespace LifecycleTypes {
  export interface MovingAveragesUnit {
    amount: number;
    timestamp: string;
  }

  export interface GrowthRateUnit {
    rate: number;
    timestamp: string;
  }

  export interface AccelerationUnit {
    acceleration: number;
    timestamp: string;
  }
}
