import { ErrorEntries } from "../constants/messages.constants";
export type ErrorEntry = (typeof ErrorEntries)[keyof typeof ErrorEntries];

import { SuccessEntries } from "../constants/messages.constants";
export type SuccessEntry = (typeof SuccessEntries)[keyof typeof SuccessEntries];
