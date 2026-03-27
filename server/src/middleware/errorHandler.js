export class AppError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true;
  }
}

export const errorHandler = (err, _req, res, _next) => {
  const statusCode = err.statusCode || 500;
  const message = err.isOperational ? err.message : "Internal server error";

  if (!err.isOperational) {
    console.error("UNHANDLED ERROR:", err);
  }

  res.status(statusCode).json({
    success: false,
    message,
  });
};

export const notFoundHandler = (_req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
  });
};
