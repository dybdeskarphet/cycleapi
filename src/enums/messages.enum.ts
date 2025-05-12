export enum ErrorMessages {
  WINDOW_SIZE_INCOMPATIBLE_LENGTH = "Window size cannot be larger than the length of the sales data.",
  NO_SALE = "No sales data found.",
  NO_PRODUCT = "No product data found.",
  INTERNAL_SERVER_ERROR = "An unexpected error occurred on the server.",
  INVALID_INTERVAL = "Interval must be one of: 'yearly', 'monthly', 'weekly', or 'daily'.",
  INVALID_ID = "The provided document ID is invalid.",
  ZOD_ERROR = "Invalid parameters. See the 'errors' field for details.",
}

export enum SuccessMessages {
  OK_MOVING_AVERAGES = "Moving averages are listed.",
  OK_GROWTH_RATES = "Growth rates are listed.",
  OK_ACCELERATION_RATES = "Acceleration rates are listed.",
  OK_LINEAR_REGRESSION_SLOPES = "Linear regression slopes are listed.",
  OK_PHASES = "Grouped Linear regression slopes and phases are listed.",
  PRODUCT_CREATED = "Product created.",
  PRODUCT_LISETED = "Product(s) are listed.",
  PRODUCT_DELETED = "Product(s) are deleted.",
  SALE_CREATED = "Sale created.",
  SALE_LISTED = "Sale(s) are listed.",
  SALE_DELETED = "Sale(s) are deleted.",
  SALE_RESTORED = "Sales are restored.",
}
