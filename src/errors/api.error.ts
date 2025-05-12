import { ErrorMessages } from "../enums/messages.enum";

class ApiError extends Error {
  status: number;
  errors: object | null;
  constructor(
    status: number,
    message: ErrorMessages,
    errors: object | null = null,
  ) {
    super(message);
    this.status = status;
    this.errors = errors && Object.keys(errors).length > 0 ? errors : null;
    //  Keep the below code for historical reasons.
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

export { ApiError };
