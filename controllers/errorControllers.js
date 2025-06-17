const AppError = require("./../utils/appError");

const handleCastErrorDB = (err) => {
  const message = `Invalid ${err.path}: ${err.value}`;
  return new AppError(message, 400);
};

const handleDuplicateErrorDB = (err) => {
  const match = err.errorResponse.errmsg.match(/"([^"]+)"/);
  const message = `Duplicate field ${match[0]}`;
  return new AppError(message, 400);
};

const handleValidationErrorDB = (err) => {
  const errors = Object.values(err.errors).map((el) => el.message);
  const message = `Invalid Input Data ${errors.join(". ")}`;
  return new AppError(message, 400);
};

const handleJWTError = (err) => {
  const message = `Invalid Token! Please login again`;
  return new AppError(message, 401);
};

const handleJWTExpireError = (err) => {
  const message = `Token Expired! Please login again`;
  return new AppError(message, 401);
};

const sendErrorDev = (err, res) => {
  res.status(err.statusCode).json({
    status: err.status,
    error: err,
    message: err.message,
    stack: err.stack,
  });
};

const sendErrorProd = (err, res) => {
  // Operational error we trust
  if (err.isOperational) {
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    });
  } else {
    //Programming or other unknown errors
    
    res.status(500).json({
      status: err.status,
      message: "Something went very Wrong!",
    });
  }
};

module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || "error";



  if (process.env.NODE_ENV === "development") {
    sendErrorDev(err, res);
  } else if (process.env.NODE_ENV === "production") {
    const error = JSON.parse(JSON.stringify(err));

    if (error.name === "CastError") {
      error = handleCastErrorDB(error);
    }
    if (error.code === 11000) {
      error = handleDuplicateErrorDB(error);
    }
    if (error.name === "ValidationError") {
      error = handleValidationErrorDB(error);
    }
    //If JWT token is invalid

    if (error.name === "JsonWebTokenError") {
      error = handleJWTError(error);
    }
    //If JWT token is expired
    if (error.name === "TokenExpiredError") {
      error = handleJWTExpireError(error);
    }
    sendErrorProd(error, res);
  }
};
