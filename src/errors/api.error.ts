import { ErrorEntry } from "../types/express.types";

class ApiError extends Error {
  status: number;
  code: string;
  errors: object | null;
  constructor(
    status: number,
    errorEntry: ErrorEntry,
    errors: object | null = null,
  ) {
    super(errorEntry.message);
    this.code = errorEntry.code;
    this.status = status;
    this.errors = errors && Object.keys(errors).length > 0 ? errors : null;
    //  Keep the below code for historical reasons.
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

export { ApiError };
