import { z, ZodObject, ZodRawShape, ZodTypeAny } from "zod";
import { ErrorEntry, SuccessEntry } from "../types/express.types";
import { ErrorEntries } from "../constants/messages.constants";
import { Types } from "mongoose";
import { ZodMediaTypeObject } from "@asteasolutions/zod-to-openapi";

export const successResponseFactory = (
  successEntry: SuccessEntry,
  data: ZodRawShape = {},
  state: boolean = true,
) => {
  return {
    description: successEntry.message,
    content: {
      "application/json": {
        schema: z.object({
          success: z.boolean().default(state),
          code: z.string().default(successEntry.code),
          message: z.string().default(successEntry.message),
          data: z.object(data),
        }),
      },
    },
  };
};

// TODO: Better naming for these
// TODO: Also, use string for errorEntry for custom messages, some http error responses can have multiple types of problems.
export const errorResponseFactory = (
  errorEntryOrString: ErrorEntry | string,
  schemas: ZodTypeAny,
) => {
  let description: string = "";

  if (typeof errorEntryOrString === "string") {
    description = errorEntryOrString as string;
  } else {
    description = (errorEntryOrString as ErrorEntry).message;
  }

  return {
    description,
    content: {
      "application/json": {
        schema: schemas,
      },
    },
  };
};

export const errorJsonFactory = (
  errorEntry: ErrorEntry,
  errors: boolean = false,
  success: boolean = false,
) => {
  let error = z.object({
    success: z.boolean().default(success),
    code: z.string().default(errorEntry.code),
    message: z.string().default(errorEntry.message),
  });

  return errors ? error.extend({ errors: z.array(z.object({})) }) : error;
};

export const BadRequestZod = errorJsonFactory(ErrorEntries.ZOD_ERROR, true);

export const DeleteCountResponseItem = z.number().default(1);

export const MiniProductResponseItem = z.object({
  _id: z.instanceof(Types.ObjectId),
  name: z.string(),
});

export const bodyRequestFactory = (
  schema: ZodTypeAny,
  required: boolean = true,
) => {
  return {
    content: {
      "application/json": {
        schema,
      },
    },
    required: true,
  };
};
