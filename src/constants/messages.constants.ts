export const SuccessEntries = {
  OK_MOVING_AVERAGES: {
    code: "OK_MOVING_AVERAGES",
    message: "Moving averages are listed.",
  },
  OK_GROWTH_RATES: {
    code: "OK_GROWTH_RATES",
    message: "Growth rates are listed.",
  },
  OK_ACCELERATION_RATES: {
    code: "OK_ACCELERATION_RATES",
    message: "Acceleration rates are listed.",
  },
  OK_LINEAR_REGRESSION_SLOPES: {
    code: "OK_LINEAR_REGRESSION_SLOPES",
    message: "Linear regression slopes are listed.",
  },
  OK_PHASES: {
    code: "OK_PHASES",
    message: "Grouped Linear regression slopes and phases are listed.",
  },
  PRODUCT_CREATED: { code: "PRODUCT_CREATED", message: "Product created." },
  PRODUCT_LISETED: {
    code: "PRODUCT_LISETED",
    message: "Product(s) are listed.",
  },
  PRODUCT_DELETED: {
    code: "PRODUCT_DELETED",
    message: "Product(s) are deleted.",
  },
  SALE_CREATED: { code: "SALE_CREATED", message: "Sale created." },
  SALE_LISTED: { code: "SALE_LISTED", message: "Sale(s) are listed." },
  SALE_DELETED: { code: "SALE_DELETED", message: "Sale(s) are deleted." },
  SALE_RESTORED: { code: "SALE_RESTORED", message: "Sales are restored." },
  TOKEN_CREATED: { code: "TOKEN_CREATED", message: "Token created." },
};

export const ErrorEntries = {
  WINDOW_SIZE_INCOMPATIBLE_LENGTH: {
    code: "WINDOW_SIZE_INCOMPATIBLE_LENGTH",
    message: "Window size cannot be larger than the length of the sales data.",
  },
  NO_SALE: { code: "NO_SALE", message: "No sales data found." },
  NO_PRODUCT: { code: "NO_PRODUCT", message: "No product data found." },
  INTERNAL_SERVER_ERROR: {
    code: "INTERNAL_SERVER_ERROR",
    message: "An unexpected error occurred on the server.",
  },
  INVALID_INTERVAL: {
    code: "INVALID_INTERVAL",
    message:
      "Interval must be one of: 'yearly', 'monthly', 'weekly', or 'daily'.",
  },
  INVALID_ID: {
    code: "INVALID_ID",
    message: "The provided document ID is invalid.",
  },
  INVALID_TOKEN: { code: "INVALID_TOKEN", message: "Invalid API Token." },
  INSUFFICIENT_PERMISSIONS: {
    code: "INSUFFICIENT_PERMISSIONS",
    message: "You don't have the permission to access this endpoint.",
  },
  ZOD_ERROR: {
    code: "ZOD_ERROR",
    message: "Invalid parameters. See the 'errors' field for details.",
  },
  INVALID_TIMEOUT: {
    code: "INVALID_TIMEOUT",
    message:
      "Timeout value should be a valid time string like '1d', or '4h1m'.",
  },
  UNAUTHORIZED: {
    code: "UNAUTHORIZED",
    message: "You're not authorized to perform this action.",
  },
};
